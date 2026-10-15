"""Exclusion rules for the APK endpoint extractor.

Run from the repo root:
    python3 -m unittest discover -s scripts/research -p "test_*.py" -v

These guard the regression fixed on 2026-10-15: third-party surface must be excluded by
HOST GROUP, never by path segment. BandLab serves real endpoints under `/experiment/...`,
so a path-prefix rule silently dropped five of them.
"""
import importlib.util
import io
import os
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location(
    'apk_to_endpoints', os.path.join(HERE, 'apk-to-endpoints.py'))
apk = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(apk)


class ThirdPartyHostTest(unittest.TestCase):
    def test_amplitude_and_branch_are_third_party(self):
        self.assertIn('AMPLITUDE_EXPERIMENT', apk.THIRD_PARTY_HOSTS)
        self.assertIn('AMPLITUDE_ANALYTICS', apk.THIRD_PARTY_HOSTS)
        self.assertIn('BRANCH', apk.THIRD_PARTY_HOSTS)

    def test_bandlab_hosts_are_not_third_party(self):
        for host in ('ACCOUNTS', 'SOCIAL', 'SAMPLES', 'API_V3', 'STATIC', 'SOUNDS'):
            self.assertNotIn(host, apk.THIRD_PARTY_HOSTS)


class ExclusionIsByHostTest(unittest.TestCase):
    """`write_endpoints` drops a record only when its HOST is third-party."""

    def _write(self, records, sdk=()):
        with tempfile.TemporaryDirectory() as d:
            out = os.path.join(d, 'endpoints.md')
            apk.write_endpoints(records, set(sdk), out)
            return io.open(out, encoding='utf-8').read()

    @staticmethod
    def _rec(path, host, verb='GET'):
        return {'path': path, 'host': host, 'verb': verb, 'authorized': True,
                'service': 'Svc', 'response_shapes': []}

    def test_experiment_path_on_bandlab_host_is_kept(self):
        text = self._write([self._rec('experiment/users/{id}/membership-status', 'ACCOUNTS')])
        self.assertIn('membership-status', text)

    def test_experiment_path_on_amplitude_host_is_dropped(self):
        text = self._write([self._rec('experiment/score', 'AMPLITUDE_EXPERIMENT')])
        self.assertNotIn('experiment/score', text)

    def test_branch_path_is_dropped(self):
        text = self._write([self._rec('registration', 'BRANCH', verb='POST')])
        self.assertNotIn('registration', text)

    def test_same_path_different_hosts_keeps_only_bandlab(self):
        recs = [self._rec('experiment/beats/{id}', 'AMPLITUDE_EXPERIMENT'),
                self._rec('experiment/beats/{id}', 'SAMPLES')]
        text = self._write(recs)
        self.assertIn('experiment/beats/{id}', text)
        self.assertEqual(1, text.count('experiment/beats/{id}'))

    def test_all_bandlab_hosts_survive(self):
        recs = [self._rec('experiment/beats-filters', 'SAMPLES'),
                self._rec('experiment/feeds/communities/posts', 'ACCOUNTS'),
                self._rec('experiment/users/{id}/purchases/beats', 'SAMPLES')]
        text = self._write(recs)
        for frag in ('beats-filters', 'communities/posts', 'purchases/beats'):
            self.assertIn(frag, text)


if __name__ == '__main__':
    unittest.main()
