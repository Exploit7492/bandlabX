# Shared

Types:

- <code><a href="./src/resources/shared.ts">ImageSample</a></code>
- <code><a href="./src/resources/shared.ts">ImageSampleCounters</a></code>
- <code><a href="./src/resources/shared.ts">Lyrics</a></code>
- <code><a href="./src/resources/shared.ts">PostCounters</a></code>
- <code><a href="./src/resources/shared.ts">RevisionSummary</a></code>
- <code><a href="./src/resources/shared.ts">VideoSample</a></code>
- <code><a href="./src/resources/shared.ts">VideoSampleCounters</a></code>

# Validation

Types:

- <code><a href="./src/resources/validation.ts">ValidationValidateResponse</a></code>

Methods:

- <code title="get /validation/{entityType}">client.validation.<a href="./src/resources/validation.ts">validate</a>(entityType, { ...params }) -> ValidationValidateResponse</code>

# Me

Types:

- <code><a href="./src/resources/me.ts">GeoCoordinate</a></code>
- <code><a href="./src/resources/me.ts">Location</a></code>
- <code><a href="./src/resources/me.ts">Picture</a></code>
- <code><a href="./src/resources/me.ts">Profile</a></code>
- <code><a href="./src/resources/me.ts">UserCounters</a></code>

Methods:

- <code title="get /me">client.me.<a href="./src/resources/me.ts">retrieve</a>() -> Profile</code>
- <code title="patch /me">client.me.<a href="./src/resources/me.ts">update</a>({ ...params }) -> Profile</code>

# Users

Types:

- <code><a href="./src/resources/users/users.ts">CollectionList</a></code>
- <code><a href="./src/resources/users/users.ts">SongList</a></code>
- <code><a href="./src/resources/users/users.ts">UserRetrieveResponse</a></code>
- <code><a href="./src/resources/users/users.ts">UserCreateAccessKeyResponse</a></code>
- <code><a href="./src/resources/users/users.ts">UserListCommunitiesResponse</a></code>

Methods:

- <code title="get /users/{userId}">client.users.<a href="./src/resources/users/users.ts">retrieve</a>(userID) -> UserRetrieveResponse</code>
- <code title="post /users/{userId}/keys">client.users.<a href="./src/resources/users/users.ts">createAccessKey</a>(userID) -> UserCreateAccessKeyResponse</code>
- <code title="get /users/{userId}/bands">client.users.<a href="./src/resources/users/users.ts">listBands</a>(userID, { ...params }) -> Band</code>
- <code title="get /users/{userId}/collections">client.users.<a href="./src/resources/users/users.ts">listCollections</a>(userID, { ...params }) -> CollectionList</code>
- <code title="get /users/{userId}/communities">client.users.<a href="./src/resources/users/users.ts">listCommunities</a>(userID, { ...params }) -> UserListCommunitiesResponse</code>
- <code title="get /users/{userId}/posts">client.users.<a href="./src/resources/users/users.ts">listPosts</a>(userID, { ...params }) -> PostList</code>
- <code title="get /users/{userId}/songs">client.users.<a href="./src/resources/users/users.ts">listSongs</a>(userID, { ...params }) -> SongList</code>

## Followers

Types:

- <code><a href="./src/resources/users/followers.ts">Paging</a></code>
- <code><a href="./src/resources/users/followers.ts">UserList</a></code>

Methods:

- <code title="get /users/{userId}/followers">client.users.followers.<a href="./src/resources/users/followers.ts">list</a>(userID, { ...params }) -> UserList</code>
- <code title="post /users/{userId}/followers">client.users.followers.<a href="./src/resources/users/followers.ts">add</a>(userID) -> void</code>
- <code title="delete /users/{userId}/followers">client.users.followers.<a href="./src/resources/users/followers.ts">remove</a>(userID) -> void</code>

## Following

Methods:

- <code title="get /users/{userId}/following">client.users.following.<a href="./src/resources/users/following.ts">list</a>(userID, { ...params }) -> UserList</code>
- <code title="get /users/{userId}/following/posts">client.users.following.<a href="./src/resources/users/following.ts">listPosts</a>(userID, { ...params }) -> PostList</code>

## Invites

Types:

- <code><a href="./src/resources/users/invites.ts">InviteList</a></code>

Methods:

- <code title="get /users/{userId}/invites">client.users.invites.<a href="./src/resources/users/invites.ts">list</a>(userID, { ...params }) -> InviteList</code>
- <code title="post /users/{userId}/invites">client.users.invites.<a href="./src/resources/users/invites.ts">send</a>(userID, { ...params }) -> void</code>

## Notifications

Types:

- <code><a href="./src/resources/users/notifications.ts">NotificationList</a></code>
- <code><a href="./src/resources/users/notifications.ts">NotificationPatch</a></code>
- <code><a href="./src/resources/users/notifications.ts">NotificationCountResponse</a></code>

Methods:

- <code title="patch /users/{userId}/notifications/{notificationId}">client.users.notifications.<a href="./src/resources/users/notifications.ts">update</a>(notificationID, { ...params }) -> void</code>
- <code title="get /users/{userId}/notifications">client.users.notifications.<a href="./src/resources/users/notifications.ts">list</a>(userID, { ...params }) -> NotificationList</code>
- <code title="get /users/{userId}/notifications/count">client.users.notifications.<a href="./src/resources/users/notifications.ts">count</a>(userID) -> NotificationCountResponse</code>
- <code title="get /users/{userId}/notifications/following">client.users.notifications.<a href="./src/resources/users/notifications.ts">listFollowing</a>(userID, { ...params }) -> NotificationList</code>
- <code title="patch /users/{userId}/notifications">client.users.notifications.<a href="./src/resources/users/notifications.ts">updateAll</a>(userID, { ...params }) -> void</code>

## Recommendations

Methods:

- <code title="get /users/{userId}/recommendations/users">client.users.recommendations.<a href="./src/resources/users/recommendations.ts">listUsers</a>(userID, { ...params }) -> UserSummaryList</code>

## Contacts

Types:

- <code><a href="./src/resources/users/contacts.ts">ContactListBandsResponse</a></code>

Methods:

- <code title="get /users/{userId}/contacts/bands">client.users.contacts.<a href="./src/resources/users/contacts.ts">listBands</a>(userID, { ...params }) -> ContactListBandsResponse</code>
- <code title="get /users/{userId}/contacts/users">client.users.contacts.<a href="./src/resources/users/contacts.ts">listUsers</a>(userID, { ...params }) -> UserSummaryList</code>

## Blocks

### Users

Methods:

- <code title="get /users/{userId}/blocks/users">client.users.blocks.users.<a href="./src/resources/users/blocks/users.ts">list</a>(userID, { ...params }) -> UserSummaryList</code>
- <code title="post /users/{userId}/blocks/users/{blockedUserId}">client.users.blocks.users.<a href="./src/resources/users/blocks/users.ts">add</a>(blockedUserID, { ...params }) -> void</code>
- <code title="delete /users/{userId}/blocks/users/{blockedUserId}">client.users.blocks.users.<a href="./src/resources/users/blocks/users.ts">remove</a>(blockedUserID, { ...params }) -> void</code>

# Bands

Types:

- <code><a href="./src/resources/bands/bands.ts">Band</a></code>
- <code><a href="./src/resources/bands/bands.ts">BandCounters</a></code>
- <code><a href="./src/resources/bands/bands.ts">Creator</a></code>
- <code><a href="./src/resources/bands/bands.ts">GroupMemberSummary</a></code>

Methods:

- <code title="post /bands">client.bands.<a href="./src/resources/bands/bands.ts">create</a>({ ...params }) -> Band</code>
- <code title="get /bands/{bandId}">client.bands.<a href="./src/resources/bands/bands.ts">retrieve</a>(bandID) -> Band</code>
- <code title="patch /bands/{bandId}">client.bands.<a href="./src/resources/bands/bands.ts">update</a>(bandID, { ...params }) -> Band</code>
- <code title="delete /bands/{bandId}">client.bands.<a href="./src/resources/bands/bands.ts">delete</a>(bandID) -> void</code>
- <code title="get /bands/{bandId}/posts">client.bands.<a href="./src/resources/bands/bands.ts">listPosts</a>(bandID, { ...params }) -> PostList</code>
- <code title="get /bands/{bandId}/songs">client.bands.<a href="./src/resources/bands/bands.ts">listSongs</a>(bandID, { ...params }) -> SongList</code>

## Members

Types:

- <code><a href="./src/resources/bands/members.ts">GroupMember</a></code>
- <code><a href="./src/resources/bands/members.ts">GroupMemberList</a></code>

Methods:

- <code title="get /bands/{bandId}/members/{userId}">client.bands.members.<a href="./src/resources/bands/members.ts">retrieve</a>(userID, { ...params }) -> GroupMember</code>
- <code title="patch /bands/{bandId}/members/{userId}">client.bands.members.<a href="./src/resources/bands/members.ts">update</a>(userID, { ...params }) -> GroupMember</code>
- <code title="get /bands/{bandId}/members">client.bands.members.<a href="./src/resources/bands/members.ts">list</a>(bandID, { ...params }) -> GroupMemberList</code>
- <code title="delete /bands/{bandId}/members/{userId}">client.bands.members.<a href="./src/resources/bands/members.ts">remove</a>(userID, { ...params }) -> void</code>

## Invites

Methods:

- <code title="get /bands/{bandId}/invites">client.bands.invites.<a href="./src/resources/bands/invites.ts">list</a>(bandID, { ...params }) -> InviteList</code>
- <code title="post /bands/{bandId}/invites">client.bands.invites.<a href="./src/resources/bands/invites.ts">send</a>(bandID, { ...params }) -> void</code>

# Collections

Types:

- <code><a href="./src/resources/collections/collections.ts">Collection</a></code>
- <code><a href="./src/resources/collections/collections.ts">CollectionCounters</a></code>

Methods:

- <code title="post /collections">client.collections.<a href="./src/resources/collections/collections.ts">create</a>({ ...params }) -> Collection</code>
- <code title="get /collections/{collectionId}">client.collections.<a href="./src/resources/collections/collections.ts">retrieve</a>(collectionID) -> Collection</code>
- <code title="patch /collections/{collectionId}">client.collections.<a href="./src/resources/collections/collections.ts">update</a>(collectionID, { ...params }) -> Collection</code>
- <code title="delete /collections/{collectionId}">client.collections.<a href="./src/resources/collections/collections.ts">delete</a>(collectionID) -> void</code>

## Posts

Types:

- <code><a href="./src/resources/collections/posts.ts">ClientID</a></code>
- <code><a href="./src/resources/collections/posts.ts">Post</a></code>
- <code><a href="./src/resources/collections/posts.ts">Status</a></code>

Methods:

- <code title="get /collections/{collectionId}/posts/{postId}">client.collections.posts.<a href="./src/resources/collections/posts.ts">retrieve</a>(postID, { ...params }) -> Post</code>
- <code title="post /collections/{collectionId}/posts/{postId}">client.collections.posts.<a href="./src/resources/collections/posts.ts">add</a>(postID, { ...params }) -> Post</code>
- <code title="delete /collections/{collectionId}/posts/{postId}">client.collections.posts.<a href="./src/resources/collections/posts.ts">remove</a>(postID, { ...params }) -> void</code>
- <code title="patch /collections/{collectionId}/posts/{postId}">client.collections.posts.<a href="./src/resources/collections/posts.ts">updatePosition</a>(postID, { ...params }) -> void</code>

## Likes

Types:

- <code><a href="./src/resources/collections/likes.ts">UserSummaryList</a></code>

Methods:

- <code title="get /collections/{collectionId}/likes">client.collections.likes.<a href="./src/resources/collections/likes.ts">list</a>(collectionID, { ...params }) -> UserSummaryList</code>
- <code title="post /collections/{collectionId}/likes">client.collections.likes.<a href="./src/resources/collections/likes.ts">add</a>(collectionID) -> void</code>
- <code title="delete /collections/{collectionId}/likes">client.collections.likes.<a href="./src/resources/collections/likes.ts">remove</a>(collectionID) -> void</code>

# Posts

Types:

- <code><a href="./src/resources/posts/posts.ts">Invite</a></code>
- <code><a href="./src/resources/posts/posts.ts">PostList</a></code>
- <code><a href="./src/resources/posts/posts.ts">SongSummary</a></code>
- <code><a href="./src/resources/posts/posts.ts">UserSummary</a></code>

Methods:

- <code title="get /posts/{postId}">client.posts.<a href="./src/resources/posts/posts.ts">retrieve</a>(postID) -> Invite</code>
- <code title="patch /posts/{postId}">client.posts.<a href="./src/resources/posts/posts.ts">update</a>(postID) -> void</code>
- <code title="get /posts">client.posts.<a href="./src/resources/posts/posts.ts">list</a>({ ...params }) -> PostList</code>
- <code title="delete /posts/{postId}">client.posts.<a href="./src/resources/posts/posts.ts">delete</a>(postID) -> void</code>

## Comments

Types:

- <code><a href="./src/resources/posts/comments.ts">Comment</a></code>
- <code><a href="./src/resources/posts/comments.ts">CommentListResponse</a></code>

Methods:

- <code title="post /posts/{postId}/comments">client.posts.comments.<a href="./src/resources/posts/comments.ts">create</a>(postID, { ...params }) -> Comment</code>
- <code title="get /posts/{postId}/comments">client.posts.comments.<a href="./src/resources/posts/comments.ts">list</a>(postID, { ...params }) -> CommentListResponse</code>
- <code title="delete /posts/{postId}/comments/{commentId}">client.posts.comments.<a href="./src/resources/posts/comments.ts">delete</a>(commentID, { ...params }) -> void</code>

## Likes

Methods:

- <code title="post /posts/{postId}/likes">client.posts.likes.<a href="./src/resources/posts/likes.ts">create</a>(postID) -> void</code>
- <code title="get /posts/{postId}/likes">client.posts.likes.<a href="./src/resources/posts/likes.ts">list</a>(postID, { ...params }) -> UserSummaryList</code>
- <code title="delete /posts/{postId}/likes">client.posts.likes.<a href="./src/resources/posts/likes.ts">delete</a>(postID) -> void</code>

# Videos

Methods:

- <code title="post /videos/{videoId}/views">client.videos.<a href="./src/resources/videos.ts">addView</a>(videoID) -> void</code>
- <code title="post /videos/{videoId}/posts">client.videos.<a href="./src/resources/videos.ts">createPost</a>(videoID, { ...params }) -> Post</code>

# Images

Methods:

- <code title="post /images/{imageId}/posts">client.images.<a href="./src/resources/images.ts">createPost</a>(imageID, { ...params }) -> Post</code>

# Revisions

Types:

- <code><a href="./src/resources/revisions.ts">AudioSample</a></code>
- <code><a href="./src/resources/revisions.ts">Mastering</a></code>
- <code><a href="./src/resources/revisions.ts">Revision</a></code>
- <code><a href="./src/resources/revisions.ts">RevisionCounters</a></code>

Methods:

- <code title="post /revisions">client.revisions.<a href="./src/resources/revisions.ts">create</a>({ ...params }) -> Revision</code>
- <code title="get /revisions/{revisionId}">client.revisions.<a href="./src/resources/revisions.ts">retrieve</a>(revisionID) -> Revision</code>
- <code title="patch /revisions/{revisionId}">client.revisions.<a href="./src/resources/revisions.ts">update</a>(revisionID, { ...params }) -> Revision</code>
- <code title="post /revisions/{revisionId}/plays">client.revisions.<a href="./src/resources/revisions.ts">addPlay</a>(revisionID) -> void</code>

# Invites

Types:

- <code><a href="./src/resources/invites.ts">InviteBatch</a></code>

Methods:

- <code title="get /invites/{inviteId}">client.invites.<a href="./src/resources/invites.ts">retrieve</a>(inviteID) -> Invite</code>
- <code title="delete /invites/{inviteId}">client.invites.<a href="./src/resources/invites.ts">delete</a>(inviteID) -> void</code>
- <code title="put /invites/{inviteId}">client.invites.<a href="./src/resources/invites.ts">accept</a>(inviteID) -> void</code>
- <code title="post /invites">client.invites.<a href="./src/resources/invites.ts">send</a>({ ...params }) -> void</code>

# Reports

Methods:

- <code title="post /reports">client.reports.<a href="./src/resources/reports.ts">create</a>({ ...params }) -> void</code>

# Feedback

Methods:

- <code title="post /feedback">client.feedback.<a href="./src/resources/feedback.ts">create</a>({ ...params }) -> void</code>

# Versions

Types:

- <code><a href="./src/resources/versions.ts">VersionRetrieveResponse</a></code>
- <code><a href="./src/resources/versions.ts">VersionValidateResponse</a></code>

Methods:

- <code title="get /versions/{clientId}">client.versions.<a href="./src/resources/versions.ts">retrieve</a>(clientID) -> VersionRetrieveResponse</code>
- <code title="get /versions/{clientId}/{version}/valid">client.versions.<a href="./src/resources/versions.ts">validate</a>(version, { ...params }) -> VersionValidateResponse</code>

# Labels

Types:

- <code><a href="./src/resources/labels.ts">LabelListResponse</a></code>

Methods:

- <code title="get /labels">client.labels.<a href="./src/resources/labels.ts">list</a>() -> LabelListResponse</code>

# Genres

Types:

- <code><a href="./src/resources/genres.ts">Genre</a></code>
- <code><a href="./src/resources/genres.ts">GenreListResponse</a></code>

Methods:

- <code title="get /genres">client.genres.<a href="./src/resources/genres.ts">list</a>() -> GenreListResponse</code>

# Skills

Types:

- <code><a href="./src/resources/skills.ts">Skill</a></code>
- <code><a href="./src/resources/skills.ts">SkillListResponse</a></code>

Methods:

- <code title="get /skills">client.skills.<a href="./src/resources/skills.ts">list</a>() -> SkillListResponse</code>

# Badges

Types:

- <code><a href="./src/resources/badges.ts">Badge</a></code>
- <code><a href="./src/resources/badges.ts">BadgeListResponse</a></code>

Methods:

- <code title="get /badges">client.badges.<a href="./src/resources/badges.ts">list</a>() -> BadgeListResponse</code>

# Push

## Registrations

Methods:

- <code title="post /push/registrations">client.push.registrations.<a href="./src/resources/push/registrations.ts">create</a>({ ...params }) -> void</code>
- <code title="delete /push/registrations">client.push.registrations.<a href="./src/resources/push/registrations.ts">delete</a>({ ...params }) -> void</code>

# Search

Types:

- <code><a href="./src/resources/search.ts">SearchGlobalSearchResponse</a></code>
- <code><a href="./src/resources/search.ts">SearchSearchBandsResponse</a></code>

Methods:

- <code title="get /search">client.search.<a href="./src/resources/search.ts">globalSearch</a>({ ...params }) -> SearchGlobalSearchResponse</code>
- <code title="get /search/bands">client.search.<a href="./src/resources/search.ts">searchBands</a>({ ...params }) -> SearchSearchBandsResponse</code>
- <code title="get /search/collections">client.search.<a href="./src/resources/search.ts">searchCollections</a>({ ...params }) -> CollectionList</code>
- <code title="get /search/songs">client.search.<a href="./src/resources/search.ts">searchSongs</a>({ ...params }) -> SongList</code>
- <code title="get /search/users">client.search.<a href="./src/resources/search.ts">searchUsers</a>({ ...params }) -> UserList</code>

# Authorizations

Types:

- <code><a href="./src/resources/authorizations.ts">Provider</a></code>
- <code><a href="./src/resources/authorizations.ts">AuthorizationCreateSessionKeyResponse</a></code>

Methods:

- <code title="post /authorizations">client.authorizations.<a href="./src/resources/authorizations.ts">createSessionKey</a>({ ...params }) -> AuthorizationCreateSessionKeyResponse</code>

# Logins

Types:

- <code><a href="./src/resources/logins.ts">Login</a></code>
- <code><a href="./src/resources/logins.ts">ProviderType139</a></code>
- <code><a href="./src/resources/logins.ts">LoginListResponse</a></code>

Methods:

- <code title="post /logins">client.logins.<a href="./src/resources/logins.ts">create</a>({ ...params }) -> Login</code>
- <code title="put /logins/{providerType}">client.logins.<a href="./src/resources/logins.ts">update</a>(providerType, { ...params }) -> Login</code>
- <code title="get /logins">client.logins.<a href="./src/resources/logins.ts">list</a>() -> LoginListResponse</code>
- <code title="delete /logins/{providerType}">client.logins.<a href="./src/resources/logins.ts">delete</a>(providerType) -> void</code>

# Emails

## Confirmations

Methods:

- <code title="put /emails/confirmations">client.emails.confirmations.<a href="./src/resources/emails/confirmations.ts">confirm</a>({ ...params }) -> void</code>
- <code title="post /emails/confirmations">client.emails.confirmations.<a href="./src/resources/emails/confirmations.ts">resend</a>() -> void</code>

# Passwords

Methods:

- <code title="put /passwords">client.passwords.<a href="./src/resources/passwords.ts">change</a>({ ...params }) -> void</code>
- <code title="post /passwords">client.passwords.<a href="./src/resources/passwords.ts">reset</a>({ ...params }) -> void</code>
- <code title="delete /passwords">client.passwords.<a href="./src/resources/passwords.ts">sendRestoreEmail</a>({ ...params }) -> void</code>

# Settings

## Notifications

### Email

Types:

- <code><a href="./src/resources/settings/notifications/email.ts">SettingsEmail</a></code>

Methods:

- <code title="get /settings/notifications/email">client.settings.notifications.email.<a href="./src/resources/settings/notifications/email.ts">retrieve</a>() -> SettingsEmail</code>
- <code title="patch /settings/notifications/email">client.settings.notifications.email.<a href="./src/resources/settings/notifications/email.ts">update</a>({ ...params }) -> SettingsEmail</code>

### Push

Types:

- <code><a href="./src/resources/settings/notifications/push.ts">SettingsPush</a></code>

Methods:

- <code title="get /settings/notifications/push">client.settings.notifications.push.<a href="./src/resources/settings/notifications/push.ts">retrieve</a>() -> SettingsEmail</code>
- <code title="patch /settings/notifications/push">client.settings.notifications.push.<a href="./src/resources/settings/notifications/push.ts">update</a>({ ...params }) -> SettingsPush</code>

# Communities

Types:

- <code><a href="./src/resources/communities/communities.ts">Community</a></code>
- <code><a href="./src/resources/communities/communities.ts">CommunityCounters</a></code>
- <code><a href="./src/resources/communities/communities.ts">Type</a></code>

Methods:

- <code title="post /communities">client.communities.<a href="./src/resources/communities/communities.ts">create</a>({ ...params }) -> Community</code>
- <code title="get /communities/{communityId}">client.communities.<a href="./src/resources/communities/communities.ts">retrieve</a>(communityID) -> Community</code>
- <code title="patch /communities/{communityId}">client.communities.<a href="./src/resources/communities/communities.ts">update</a>(communityID, { ...params }) -> Community</code>
- <code title="delete /communities/{communityId}">client.communities.<a href="./src/resources/communities/communities.ts">delete</a>(communityID) -> void</code>

## Members

Methods:

- <code title="get /communities/{communityId}/members/{userId}">client.communities.members.<a href="./src/resources/communities/members.ts">retrieve</a>(userID, { ...params }) -> GroupMember</code>
- <code title="patch /communities/{communityId}/members/{userId}">client.communities.members.<a href="./src/resources/communities/members.ts">update</a>(userID, { ...params }) -> GroupMember</code>
- <code title="get /communities/{communityId}/members">client.communities.members.<a href="./src/resources/communities/members.ts">list</a>(communityID, { ...params }) -> GroupMemberList</code>
- <code title="delete /communities/{communityId}/members/{userId}">client.communities.members.<a href="./src/resources/communities/members.ts">delete</a>(userID, { ...params }) -> void</code>

## Posts

Methods:

- <code title="post /community/{communityId}/posts">client.communities.posts.<a href="./src/resources/communities/posts.ts">create</a>(communityID, { ...params }) -> Post</code>
- <code title="get /community/{communityId}/posts">client.communities.posts.<a href="./src/resources/communities/posts.ts">list</a>(communityID, { ...params }) -> PostList</code>

## Invites

Methods:

- <code title="get /community/{communityId}/invites">client.communities.invites.<a href="./src/resources/communities/invites.ts">list</a>(communityID, { ...params }) -> InviteList</code>
- <code title="post /community/{communityId}/invites">client.communities.invites.<a href="./src/resources/communities/invites.ts">send</a>(communityID, { ...params }) -> void</code>

# Songs

Types:

- <code><a href="./src/resources/songs/songs.ts">Author</a></code>
- <code><a href="./src/resources/songs/songs.ts">Song</a></code>
- <code><a href="./src/resources/songs/songs.ts">SongCounters</a></code>
- <code><a href="./src/resources/songs/songs.ts">SongOriginal</a></code>
- <code><a href="./src/resources/songs/songs.ts">InviteLink</a></code>

Methods:

- <code title="get /songs/{songId}">client.songs.<a href="./src/resources/songs/songs.ts">retrieve</a>(songID) -> Song</code>
- <code title="patch /songs/{songId}">client.songs.<a href="./src/resources/songs/songs.ts">update</a>(songID, { ...params }) -> Song</code>
- <code title="delete /songs/{songId}">client.songs.<a href="./src/resources/songs/songs.ts">delete</a>(songID) -> void</code>
- <code title="get /songs/{songId}/posts">client.songs.<a href="./src/resources/songs/songs.ts">listPosts</a>(songID, { ...params }) -> PostList</code>
- <code title="post /songs/forks">client.songs.<a href="./src/resources/songs/songs.ts">forks</a>({ ...params }) -> Song</code>
- <code title="get /songs/{songId}/invite-link">client.songs.<a href="./src/resources/songs/songs.ts">retrieveInviteLink</a>(songID) -> InviteLink</code>

## Collaborators

Types:

- <code><a href="./src/resources/songs/collaborators.ts">CollaboratorListResponse</a></code>

Methods:

- <code title="get /songs/{songId}/collaborators">client.songs.collaborators.<a href="./src/resources/songs/collaborators.ts">list</a>(songID, { ...params }) -> CollaboratorListResponse</code>
- <code title="delete /songs/{songId}/collaborators/{userId}">client.songs.collaborators.<a href="./src/resources/songs/collaborators.ts">remove</a>(userID, { ...params }) -> void</code>

## Revisions

Types:

- <code><a href="./src/resources/songs/revisions.ts">RevisionListResponse</a></code>

Methods:

- <code title="get /songs/{songId}/revisions">client.songs.revisions.<a href="./src/resources/songs/revisions.ts">list</a>(songID, { ...params }) -> RevisionListResponse</code>
- <code title="post /songs/{songId}/revisions/{revisonId}/forks">client.songs.revisions.<a href="./src/resources/songs/revisions.ts">forks</a>(revisonID, { ...params }) -> Song</code>

## Invites

Types:

- <code><a href="./src/resources/songs/invites.ts">Invite</a></code>
- <code><a href="./src/resources/songs/invites.ts">InviteListResponse</a></code>

Methods:

- <code title="get /songs/{songId}/invites">client.songs.invites.<a href="./src/resources/songs/invites.ts">listInvites</a>(songID, { ...params }) -> InviteListResponse</code>
- <code title="post /songs/{songId}/invites">client.songs.invites.<a href="./src/resources/songs/invites.ts">sendInvites</a>(songID, { ...params }) -> void</code>
