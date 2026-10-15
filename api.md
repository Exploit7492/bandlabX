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
- <code title="get /validation/community">client.validation.<a href="./src/resources/validation.ts">validateCommunity</a>({ ...params }) -> ValidationValidateResponse</code>
- <code title="get /validation/distro">client.validation.<a href="./src/resources/validation.ts">validateDistro</a>({ ...params }) -> FieldValidationResponse</code>

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

Types:

- <code><a href="./src/resources/bands/bands.ts">SuggestedBand</a></code>
- <code><a href="./src/resources/bands/bands.ts">SuggestedBandList</a></code>

Methods:

- <code title="get /bands/suggested">client.bands.<a href="./src/resources/bands/bands.ts">listSuggested</a>({ ...params }) -> SuggestedBandList</code>
- <code title="get /bands/{bandID}/followers">client.bands.<a href="./src/resources/bands/bands.ts">listFollowers</a>(bandID, { ...params }) -> FollowersAPI.UserList</code>
- <code title="post /bands/{bandID}/followers/{userID}">client.bands.<a href="./src/resources/bands/bands.ts">addFollower</a>(bandID, userID) -> void</code>
- <code title="get /bands/{bandId}/members/{userID}/follow-invitees">client.bands.<a href="./src/resources/bands/bands.ts">listMemberFollowInvitees</a>(userID, { ...params }) -> FollowersAPI.UserList</code>
- <code title="post /bands/{bandId}/pins/posts/{postID}">client.bands.<a href="./src/resources/bands/bands.ts">pinPost</a>(postID, { ...params }) -> void</code>
- <code title="get /bands/{bandID}/videos/posts">client.bands.<a href="./src/resources/bands/bands.ts">listVideoPosts</a>(bandID, { ...params }) -> PostsAPI.PostList</code>

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
- <code title="get /collections/{collectionID}/likes">client.collections.likes.<a href="./src/resources/collections/likes.ts">list</a>(collectionID, { ...params }) -> UserSummaryList</code>
- <code title="post /collections/{collectionID}/likes">client.collections.likes.<a href="./src/resources/collections/likes.ts">add</a>(collectionID) -> void</code>
- <code title="delete /collections/{collectionID}/likes">client.collections.likes.<a href="./src/resources/collections/likes.ts">remove</a>(collectionID) -> void</code>
- <code title="get /collections/{collectionID}/likes/users">client.collections.likes.<a href="./src/resources/collections/likes.ts">listUsers</a>(collectionID, { ...params }) -> UserSummaryList</code>

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
- <code title="post /videos/{videoID}/views">client.videos.<a href="./src/resources/videos.ts">addView</a>(videoID) -> void</code>
- <code title="post /videos/{videoID}/posts">client.videos.<a href="./src/resources/videos.ts">createPost</a>(videoID, { ...params }) -> PostsAPI.Post</code>
- <code title="get /video-mix/stickers">client.videos.<a href="./src/resources/videos.ts">listStickers</a>({ ...params }) -> StickerListResponse</code>
- <code title="get /videos/{videoID}">client.videos.<a href="./src/resources/videos.ts">retrieve</a>(videoID, { ...params }) -> VideoFile</code>

# Images

Methods:

- <code title="post /images/{imageId}/posts">client.images.<a href="./src/resources/images.ts">createPost</a>(imageID, { ...params }) -> Post</code>

# Revisions

Types:

- <code><a href="./src/resources/revisions.ts">Artist</a></code>
- <code><a href="./src/resources/revisions.ts">AudioSample</a></code>
- <code><a href="./src/resources/revisions.ts">Mastering</a></code>
- <code><a href="./src/resources/revisions.ts">Revision</a></code>
- <code><a href="./src/resources/revisions.ts">RevisionCounters</a></code>
- <code><a href="./src/resources/revisions.ts">SampleUri</a></code>
- <code><a href="./src/resources/revisions.ts">SharedKey</a></code>
- <code><a href="./src/resources/revisions.ts">TrackRewindBreakdown</a></code>

Methods:

- <code title="post /revisions">client.revisions.<a href="./src/resources/revisions.ts">create</a>({ ...params }) -> Revision</code>
- <code title="get /revisions/{revisionId}">client.revisions.<a href="./src/resources/revisions.ts">retrieve</a>(revisionID) -> Revision</code>
- <code title="patch /revisions/{revisionId}">client.revisions.<a href="./src/resources/revisions.ts">update</a>(revisionID, { ...params }) -> Revision</code>
- <code title="post /revisions/{revisionId}/plays">client.revisions.<a href="./src/resources/revisions.ts">addPlay</a>(revisionID) -> void</code>
- <code title="get /revisions/{revisionId}/artist">client.revisions.<a href="./src/resources/revisions.ts">retrieveArtist</a>(revisionID) -> Artist</code>
- <code title="get /revisions/{revisionId}/forks/posts">client.revisions.<a href="./src/resources/revisions.ts">listForksPosts</a>(revisionID, { ...params }) -> PostList</code>
- <code title="get /revisions/{revisionId}/likes/users">client.revisions.<a href="./src/resources/revisions.ts">listLikesUsers</a>(revisionID, { ...params }) -> UserSummaryList</code>
- <code title="get /revisions/{revisionId}/sharings">client.revisions.<a href="./src/resources/revisions.ts">retrieveSharings</a>(revisionID) -> SharedKey</code>
- <code title="get /revisions/{revisionId}/studio-breakdown">client.revisions.<a href="./src/resources/revisions.ts">retrieveStudioBreakdown</a>(revisionID) -> TrackRewindBreakdown</code>
- <code title="get /revisions/{revisionId}/track-videos/posts">client.revisions.<a href="./src/resources/revisions.ts">listTrackVideoPosts</a>(revisionID, { ...params }) -> PostList</code>
- <code title="get /revisions/{revisionId}">client.revisions.<a href="./src/resources/revisions.ts">retrieveDownload</a>(revisionID, { ...params }) -> SampleUri</code>
- <code title="post /revisions/{revisionId}/mixdown/reprocess">client.revisions.<a href="./src/resources/revisions.ts">reprocessMixdown</a>(revisionID, { ...params }) -> void</code>
- <code title="patch /contour/{projectID}/{regionID}/{activeSampleID}">client.revisions.<a href="./src/resources/revisions.ts">updateContour</a>(activeSampleID, { ...params }) -> void</code>

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
- <code title="get /genres/{genreID}/posts/trending">client.genres.<a href="./src/resources/genres.ts">listTrendingPosts</a>(genreID, { ...params }) -> PostsAPI.PostList</code>

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
- <code title="get /search">client.search.<a href="./src/resources/search.ts">globalSearch</a>({ ...params }) -> SearchGlobalSearchResponse</code>
- <code title="get /search/bands">client.search.<a href="./src/resources/search.ts">searchBands</a>({ ...params }) -> SearchSearchBandsResponse</code>
- <code title="get /search/collections">client.search.<a href="./src/resources/search.ts">searchCollections</a>({ ...params }) -> UsersAPI.CollectionList</code>
- <code title="get /search/songs">client.search.<a href="./src/resources/search.ts">searchSongs</a>({ ...params }) -> UsersAPI.SongList</code>
- <code title="get /search/users">client.search.<a href="./src/resources/search.ts">searchUsers</a>({ ...params }) -> FollowersAPI.UserList</code>
- <code title="post /grouping/users/{userID}/tokens">client.search.<a href="./src/resources/search.ts">createGroupingToken</a>(userID, { ...params }) -> void</code>
- <code title="get /hashtags/{name}/posts">client.search.<a href="./src/resources/search.ts">listHashtagPosts</a>(name, { ...params }) -> PostsAPI.PostList</code>
- <code title="get /places">client.search.<a href="./src/resources/search.ts">listPlaces</a>({ ...params }) -> SearchLocationResultList</code>
- <code title="get /search/albums">client.search.<a href="./src/resources/search.ts">searchAlbums</a>({ ...params }) -> AlbumsAPI.AlbumList</code>
- <code title="get /search/communities">client.search.<a href="./src/resources/search.ts">searchCommunities</a>({ ...params }) -> CommunitiesAPI.CommunityList</code>
- <code title="get /search/tags">client.search.<a href="./src/resources/search.ts">searchTags</a>({ ...params }) -> HashtagList</code>
- <code title="get /suggestions">client.search.<a href="./src/resources/search.ts">listSuggestions</a>({ ...params }) -> SearchSuggestionDtoList</code>
- <code title="get /tags">client.search.<a href="./src/resources/search.ts">listTags</a>({ ...params }) -> HashtagList</code>

# Authorizations

Types:

- <code><a href="./src/resources/authorizations.ts">Provider</a></code>
- <code><a href="./src/resources/authorizations.ts">AuthorizationCreateSessionKeyResponse</a></code>

Methods:

- <code title="post /authorizations">client.authorizations.<a href="./src/resources/authorizations.ts">createSessionKey</a>({ ...params }) -> AuthorizationCreateSessionKeyResponse</code>
- <code title="get /authorization/two-factor-methods">client.authorizations.<a href="./src/resources/authorizations.ts">listTwoFactorMethods</a>({ ...params }) -> TwoFactorAuthEmailResponse</code>
- <code title="post /authorization/two-factor-requests/email">client.authorizations.<a href="./src/resources/authorizations.ts">createTwoFactorRequest</a>({ ...params }) -> TwoFactorSendCodeResponse</code>
- <code title="post /connect/token">client.authorizations.<a href="./src/resources/authorizations.ts">createToken</a>({ ...params }) -> Session</code>
- <code title="get /external/token">client.authorizations.<a href="./src/resources/authorizations.ts">retrieveExternalToken</a>({ ...params }) -> NonceToken</code>
- <code title="post /logout">client.authorizations.<a href="./src/resources/authorizations.ts">logout</a>({ ...params }) -> void</code>

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
- <code title="put /passwords">client.passwords.<a href="./src/resources/passwords.ts">change</a>({ ...params }) -> void</code>
- <code title="post /passwords">client.passwords.<a href="./src/resources/passwords.ts">reset</a>({ ...params }) -> void</code>
- <code title="delete /passwords">client.passwords.<a href="./src/resources/passwords.ts">sendRestoreEmail</a>({ ...params }) -> void</code>
- <code title="post /passwords/reset">client.passwords.<a href="./src/resources/passwords.ts">resetPassword</a>({ ...params }) -> void</code>

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

# Albums

Types:

- <code><a href="./src/resources/albums.ts">Album</a></code>
- <code><a href="./src/resources/albums.ts">AlbumCounters</a></code>
- <code><a href="./src/resources/albums.ts">AlbumTheme</a></code>
- <code><a href="./src/resources/albums.ts">AlbumComment</a></code>
- <code><a href="./src/resources/albums.ts">InspiredArtist</a></code>
- <code><a href="./src/resources/albums.ts">AlbumPost</a></code>
- <code><a href="./src/resources/albums.ts">AlbumThemeList</a></code>
- <code><a href="./src/resources/albums.ts">InspiredArtistList</a></code>
- <code><a href="./src/resources/albums.ts">UserSummaryList</a></code>
- <code><a href="./src/resources/albums.ts">AlbumCommentList</a></code>

Methods:

- <code title="post /albums">client.albums.<a href="./src/resources/albums.ts">create</a>({ ...params }) -> Album</code>
- <code title="get /albums/{albumID}">client.albums.<a href="./src/resources/albums.ts">retrieve</a>(albumID) -> Album</code>
- <code title="get /albums/themes">client.albums.<a href="./src/resources/albums.ts">listThemes</a>() -> AlbumThemeList</code>
- <code title="get /artists">client.albums.<a href="./src/resources/albums.ts">listArtists</a>({ ...params }) -> InspiredArtistList</code>
- <code title="put /albums/{albumID}/picture">client.albums.<a href="./src/resources/albums.ts">updatePicture</a>(albumID, { ...params }) -> void</code>
- <code title="put /albums/{albumID}/state">client.albums.<a href="./src/resources/albums.ts">updateState</a>(albumID, { ...params }) -> void</code>
- <code title="post /albums/{albumID}/likes/users/{userID}">client.albums.<a href="./src/resources/albums.ts">addLike</a>(albumID, userID) -> void</code>
- <code title="get /albums/{albumID}/likes/users">client.albums.<a href="./src/resources/albums.ts">listLikesUsers</a>(albumID, { ...params }) -> UserSummaryList</code>
- <code title="post /albums/{albumID}/posts">client.albums.<a href="./src/resources/albums.ts">createPost</a>(albumID, { ...params }) -> AlbumPost</code>
- <code title="post /albums/{albumID}/posts/{postID}">client.albums.<a href="./src/resources/albums.ts">addPost</a>(albumID, postID) -> void</code>
- <code title="put /albums/{albumID}/posts/{postID}/order">client.albums.<a href="./src/resources/albums.ts">updatePostOrder</a>(albumID, postID, { ...params }) -> void</code>
- <code title="get /albums/{albumID}/comments">client.albums.<a href="./src/resources/albums.ts">listComments</a>(albumID, { ...params }) -> AlbumCommentList</code>
- <code title="delete /albums/{albumID}/comments/{commentID}">client.albums.<a href="./src/resources/albums.ts">deleteComment</a>(albumID, commentID) -> void</code>
- <code title="get /albums/{albumID}/comments/{commentID}/likes/users">client.albums.<a href="./src/resources/albums.ts">listCommentLikesUsers</a>(albumID, commentID, { ...params }) -> UserSummaryList</code>
- <code title="post /albums/{albumID}/comments/{commentID}/likes/users/{userID}">client.albums.<a href="./src/resources/albums.ts">addCommentLike</a>(albumID, commentID, userID) -> void</code>

# Effects

Types:

- <code><a href="./src/resources/effects.ts">UnSavedPreset</a></code>
- <code><a href="./src/resources/effects.ts">SavedPreset</a></code>
- <code><a href="./src/resources/effects.ts">RemotePreset</a></code>
- <code><a href="./src/resources/effects.ts">PresetAttributor</a></code>
- <code><a href="./src/resources/effects.ts">FavoriteEffect</a></code>
- <code><a href="./src/resources/effects.ts">RemotePresetList</a></code>
- <code><a href="./src/resources/effects.ts">FavoriteEffectList</a></code>

Methods:

- <code title="get /effect-presets/{linkToken}">client.effects.<a href="./src/resources/effects.ts">retrievePresetByLink</a>(linkToken) -> UnSavedPreset</code>
- <code title="post /users/{userID}/effect-presets">client.effects.<a href="./src/resources/effects.ts">createPreset</a>(userID, { ...params }) -> SavedPreset</code>
- <code title="patch /users/{userId}/effect-presets/{presetID}">client.effects.<a href="./src/resources/effects.ts">updatePreset</a>(presetID, { ...params }) -> SavedPreset</code>
- <code title="delete /users/{userId}/effect-presets/{presetID}/link">client.effects.<a href="./src/resources/effects.ts">deletePresetLink</a>(presetID, { ...params }) -> SavedPreset</code>
- <code title="get /users/{userId}/effect-presets/promo-campaigns/{campaignID}/content">client.effects.<a href="./src/resources/effects.ts">retrievePromoPreset</a>(campaignID, { ...params }) -> RemotePreset</code>
- <code title="get /users/{userID}/trending-effect-presets">client.effects.<a href="./src/resources/effects.ts">listTrendingPresets</a>(userID, { ...params }) -> RemotePresetList</code>
- <code title="get /users/{userID}/favorite-effect-ids">client.effects.<a href="./src/resources/effects.ts">listFavoriteEffects</a>(userID, { ...params }) -> FavoriteEffectList</code>
- <code title="post /users/{userID}/favorite-effect-ids/{effectID}">client.effects.<a href="./src/resources/effects.ts">addFavoriteEffect</a>(userID, effectID) -> void</code>
- <code title="get /users/{userID}/favorite-effect-presets-ids">client.effects.<a href="./src/resources/effects.ts">listFavoritePresets</a>(userID, { ...params }) -> unknown</code>
- <code title="post /users/{userID}/favorite-effect-presets-ids/{presetID}">client.effects.<a href="./src/resources/effects.ts">addFavoritePreset</a>(userID, presetID) -> void</code>

# Sounds

Types:

- <code><a href="./src/resources/sounds/sounds.ts">SeparationStatusResponse</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">SeparationLimitsResponse</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">ForwardResultResponse</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">SeparationProgressResponse</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">PaletteInstrument</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">LoopMatch</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">LoopPack</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">LoopsFilter</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">FilterRange</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">LoopSample</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">FilterDto</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">SamplePackIdDto</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">StorageObject</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">CreditsResponse</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">ClaimedSampleIdsResponse</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">MySoundsLibraryResponse</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">SoundsPackDto</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">SamplerKitDTO</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">SoundsSampleDto</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">SampleStorageInfoDto</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">CreateUploadUrlResponse</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">IdeasResponseModel</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">NativeAds</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">PaletteInstrumentList</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">LoopMatchList</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">LoopPackList</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">LoopsFilterList</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">LoopSampleList</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">FilterDtoList</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">SamplePackIdDtoList</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">SoundsPackDtoList</a></code>
- <code><a href="./src/resources/sounds/sounds.ts">SoundsSampleDtoList</a></code>

Methods:

- <code title="post /v4/separation">client.sounds.<a href="./src/resources/sounds/sounds.ts">createSeparation</a>({ ...params }) -> SeparationStatusResponse</code>
- <code title="get /instruments">client.sounds.<a href="./src/resources/sounds/sounds.ts">listInstruments</a>({ ...params }) -> PaletteInstrumentList</code>
- <code title="get /loops/matches">client.sounds.<a href="./src/resources/sounds/sounds.ts">listLoopMatches</a>({ ...params }) -> LoopMatchList</code>
- <code title="get /packs">client.sounds.<a href="./src/resources/sounds/sounds.ts">listPacks</a>({ ...params }) -> LoopPackList</code>
- <code title="get /packs/filters">client.sounds.<a href="./src/resources/sounds/sounds.ts">listPackFilters</a>({ ...params }) -> LoopsFilterList</code>
- <code title="get /samples">client.sounds.<a href="./src/resources/sounds/sounds.ts">listSamples</a>({ ...params }) -> LoopSampleList</code>
- <code title="get /samples/filters">client.sounds.<a href="./src/resources/sounds/sounds.ts">listSampleFilters</a>({ ...params }) -> FilterDtoList</code>
- <code title="post /samples/pack-ids">client.sounds.<a href="./src/resources/sounds/sounds.ts">resolveSamplePackIDs</a>({ ...params }) -> SamplePackIdDtoList</code>
- <code title="put /samples/{sampleID}">client.sounds.<a href="./src/resources/sounds/sounds.ts">updateSample</a>(sampleID, { ...params }) -> StorageObject</code>
- <code title="get /samples/{sampleID}">client.sounds.<a href="./src/resources/sounds/sounds.ts">retrieveSampleDownload</a>(sampleID, { ...params }) -> RevisionsAPI.SampleUri</code>
- <code title="get /samples/{sampleID}">client.sounds.<a href="./src/resources/sounds/sounds.ts">retrieveSampleMIDIDownload</a>(sampleID, { ...params }) -> RevisionsAPI.SampleUri</code>
- <code title="get /stamps/{stamp}/revision">client.sounds.<a href="./src/resources/sounds/sounds.ts">retrieveStampRevision</a>(stamp) -> RevisionsAPI.Revision</code>
- <code title="post /users/{userID}/claims/samples">client.sounds.<a href="./src/resources/sounds/sounds.ts">claimSamples</a>(userID, { ...params }) -> CreditsResponse</code>
- <code title="get /users/{userID}/claims/samples/ids">client.sounds.<a href="./src/resources/sounds/sounds.ts">listClaimedSampleIDs</a>(userID, { ...params }) -> ClaimedSampleIdsResponse</code>
- <code title="put /users/{userId}/claims/samples/{sampleID}">client.sounds.<a href="./src/resources/sounds/sounds.ts">claimSample</a>(sampleID, { ...params }) -> CreditsResponse</code>
- <code title="get /users/{userID}/credits">client.sounds.<a href="./src/resources/sounds/sounds.ts">retrieveCredits</a>(userID) -> CreditsResponse</code>
- <code title="get /users/{userID}/libraries/packs">client.sounds.<a href="./src/resources/sounds/sounds.ts">listLibraryPacks</a>(userID, { ...params }) -> MySoundsLibraryResponse</code>
- <code title="get /users/{userID}/libraries/samples">client.sounds.<a href="./src/resources/sounds/sounds.ts">listLibrarySamples</a>(userID, { ...params }) -> MySoundsLibraryResponse</code>
- <code title="get /users/{userID}/packs">client.sounds.<a href="./src/resources/sounds/sounds.ts">listUserPacks</a>(userID, { ...params }) -> SoundsPackDtoList</code>
- <code title="put /users/{userId}/packs/{packID}">client.sounds.<a href="./src/resources/sounds/sounds.ts">updateUserPack</a>(packID, { ...params }) -> void</code>
- <code title="post /users/{userID}/sampler-kits">client.sounds.<a href="./src/resources/sounds/sounds.ts">createSamplerKit</a>(userID, { ...params }) -> SamplerKitDTO</code>
- <code title="put /users/{userId}/sampler-kits/{samplerKitID}">client.sounds.<a href="./src/resources/sounds/sounds.ts">updateSamplerKit</a>(samplerKitID, { ...params }) -> SamplerKitDTO</code>
- <code title="get /users/{userID}/samples">client.sounds.<a href="./src/resources/sounds/sounds.ts">listUserSamples</a>(userID, { ...params }) -> SoundsSampleDtoList</code>
- <code title="put /users/{userId}/samples/{sampleID}">client.sounds.<a href="./src/resources/sounds/sounds.ts">updateUserSample</a>(sampleID, { ...params }) -> void</code>
- <code title="get /users/{userID}/uploads">client.sounds.<a href="./src/resources/sounds/sounds.ts">retrieveUploadStorage</a>(userID) -> SampleStorageInfoDto</code>
- <code title="post /users/{userID}/uploads/samples">client.sounds.<a href="./src/resources/sounds/sounds.ts">createUploadURL</a>(userID, { ...params }) -> CreateUploadUrlResponse</code>
- <code title="delete /users/{userId}/uploads/samples/{sampleID}">client.sounds.<a href="./src/resources/sounds/sounds.ts">deleteUpload</a>(sampleID, { ...params }) -> void</code>
- <code title="get /v3/ideas">client.sounds.<a href="./src/resources/sounds/sounds.ts">listIdeas</a>({ ...params }) -> IdeasResponseModel</code>
- <code title="get /v3/native">client.sounds.<a href="./src/resources/sounds/sounds.ts">retrieveNativeAds</a>({ ...params }) -> NativeAds</code>
- <code title="get /v3/video">client.sounds.<a href="./src/resources/sounds/sounds.ts">retrieveVideoAd</a>({ ...params }) -> unknown</code>

# Uploads

Types:

- <code><a href="./src/resources/uploads.ts">SpatialStudioUploadResponse</a></code>
- <code><a href="./src/resources/uploads.ts">FileUploadSession</a></code>
- <code><a href="./src/resources/uploads.ts">FileUploadPart</a></code>
- <code><a href="./src/resources/uploads.ts">UploadMedia</a></code>

Methods:

- <code title="post /upload">client.uploads.<a href="./src/resources/uploads.ts">createSpatialProject</a>({ ...params }) -> SpatialStudioUploadResponse</code>
- <code title="post /upload/{projectID}/{regionID}/{activeSampleID}">client.uploads.<a href="./src/resources/uploads.ts">createProjectSample</a>(activeSampleID, { ...params }) -> unknown</code>
- <code title="post /uploads/videos">client.uploads.<a href="./src/resources/uploads.ts">createVideoSession</a>({ ...params }) -> FileUploadSession</code>
- <code title="put /uploads/videos/{uploadID}">client.uploads.<a href="./src/resources/uploads.ts">completeVideoUpload</a>(uploadID, { ...params }) -> UploadMedia</code>

# Soundbanks

Types:

- <code><a href="./src/resources/soundbanks.ts">SoundBanksLibrary</a></code>

Methods:

- <code title="get /soundbanks">client.soundbanks.<a href="./src/resources/soundbanks.ts">list</a>() -> SoundBanksLibrary</code>

# AI

Types:

- <code><a href="./src/resources/ai/ai.ts">Link</a></code>
- <code><a href="./src/resources/ai/ai.ts">PaletteStackTaskDto</a></code>
- <code><a href="./src/resources/ai/ai.ts">PaletteStackTaskResultDto</a></code>
- <code><a href="./src/resources/ai/ai.ts">GenreResponseModel</a></code>
- <code><a href="./src/resources/ai/ai.ts">AutoMixGenresDto</a></code>
- <code><a href="./src/resources/ai/ai.ts">AutoMixPromptExamplesDto</a></code>
- <code><a href="./src/resources/ai/ai.ts">AutoMixResultDto</a></code>
- <code><a href="./src/resources/ai/ai.ts">HarmonizerVoiceDto</a></code>
- <code><a href="./src/resources/ai/ai.ts">HarmonizerPresetDto</a></code>
- <code><a href="./src/resources/ai/ai.ts">SongExamplesDTO</a></code>
- <code><a href="./src/resources/ai/ai.ts">PromptsDTO</a></code>
- <code><a href="./src/resources/ai/ai.ts">TaskStatusDTO</a></code>
- <code><a href="./src/resources/ai/ai.ts">GetModelsDTO</a></code>
- <code><a href="./src/resources/ai/ai.ts">HarmonizerVoiceDtoList</a></code>
- <code><a href="./src/resources/ai/ai.ts">HarmonizerPresetDtoList</a></code>
- <code><a href="./src/resources/ai/ai.ts">GenreResponseModelList</a></code>

Methods:

- <code title="get /v1/daily_limits">client.ai.<a href="./src/resources/ai/ai.ts">retrieveDailyLimits</a>() -> SoundsAPI.SeparationLimitsResponse</code>
- <code title="get /v1/model/{modelId}/{version}/{feature}">client.ai.<a href="./src/resources/ai/ai.ts">retrieveModel</a>(feature, { ...params }) -> unknown</code>
- <code title="delete /v1/separation">client.ai.<a href="./src/resources/ai/ai.ts">deleteSeparation</a>() -> void</code>
- <code title="get /v1/separation/prediction">client.ai.<a href="./src/resources/ai/ai.ts">retrieveSeparationPrediction</a>() -> SoundsAPI.SeparationStatusResponse</code>
- <code title="post /v1/separation/sample">client.ai.<a href="./src/resources/ai/ai.ts">createSeparationSample</a>({ ...params }) -> SoundsAPI.ForwardResultResponse</code>
- <code title="get /v1/separation/status">client.ai.<a href="./src/resources/ai/ai.ts">retrieveSeparationStatus</a>() -> SoundsAPI.SeparationProgressResponse</code>
- <code title="get /preview">client.ai.<a href="./src/resources/ai/ai.ts">retrievePreview</a>({ ...params }) -> Link</code>
- <code title="post /task">client.ai.<a href="./src/resources/ai/ai.ts">createTask</a>({ ...params }) -> PaletteStackTaskDto</code>
- <code title="get /task/{taskID}">client.ai.<a href="./src/resources/ai/ai.ts">retrieveTask</a>(taskID) -> PaletteStackTaskDto</code>
- <code title="get /task/{taskID}/download">client.ai.<a href="./src/resources/ai/ai.ts">retrieveTaskResult</a>(taskID) -> PaletteStackTaskResultDto</code>
- <code title="get /v0/similar">client.ai.<a href="./src/resources/ai/ai.ts">listSimilarSounds</a>({ ...params }) -> unknown</code>
- <code title="post /v1/autocomplete">client.ai.<a href="./src/resources/ai/ai.ts">autocomplete</a>({ ...params }) -> unknown</code>
- <code title="post /v1/check_captcha">client.ai.<a href="./src/resources/ai/ai.ts">checkCaptcha</a>({ ...params }) -> unknown</code>
- <code title="get /v1/displayed_genres">client.ai.<a href="./src/resources/ai/ai.ts">listDisplayedGenres</a>({ ...params }) -> GenreResponseModelList</code>
- <code title="get /v1/genres">client.ai.<a href="./src/resources/ai/ai.ts">listGenres</a>({ ...params }) -> AutoMixGenresDto</code>
- <code title="get /v1/ideas">client.ai.<a href="./src/resources/ai/ai.ts">listIdeas</a>({ ...params }) -> SoundsAPI.IdeasResponseModel</code>
- <code title="get /v1/instruction-suggestions">client.ai.<a href="./src/resources/ai/ai.ts">listInstructionSuggestions</a>({ ...params }) -> AutoMixPromptExamplesDto</code>
- <code title="get /v1/models">client.ai.<a href="./src/resources/ai/ai.ts">listModels</a>({ ...params }) -> HarmonizerVoiceDtoList</code>
- <code title="get /v1/presets">client.ai.<a href="./src/resources/ai/ai.ts">listPresets</a>({ ...params }) -> HarmonizerPresetDtoList</code>
- <code title="get /v1/previews">client.ai.<a href="./src/resources/ai/ai.ts">listPreviews</a>({ ...params }) -> SongExamplesDTO</code>
- <code title="get /v1/prompts">client.ai.<a href="./src/resources/ai/ai.ts">listPrompts</a>({ ...params }) -> PromptsDTO</code>
- <code title="post /v1/remix">client.ai.<a href="./src/resources/ai/ai.ts">createRemix</a>({ ...params }) -> unknown</code>
- <code title="post /v1/task">client.ai.<a href="./src/resources/ai/ai.ts">createAITask</a>({ ...params }) -> TaskStatusDTO</code>
- <code title="get /v1/task/{taskID}">client.ai.<a href="./src/resources/ai/ai.ts">retrieveAITask</a>(taskID) -> TaskStatusDTO</code>
- <code title="get /v1/task/{taskID}/download">client.ai.<a href="./src/resources/ai/ai.ts">retrieveAITaskResult</a>(taskID) -> AutoMixResultDto</code>
- <code title="post /v1/transfer">client.ai.<a href="./src/resources/ai/ai.ts">createTransfer</a>({ ...params }) -> TaskStatusDTO</code>
- <code title="get /v1/transfer/{transferID}">client.ai.<a href="./src/resources/ai/ai.ts">retrieveTransfer</a>(transferID) -> TaskStatusDTO</code>
- <code title="get /v1/transfer/{transferID}/download">client.ai.<a href="./src/resources/ai/ai.ts">retrieveTransferDownload</a>(transferID) -> unknown</code>
- <code title="get /v2/models">client.ai.<a href="./src/resources/ai/ai.ts">listV2Models</a>({ ...params }) -> GetModelsDTO</code>
- <code title="get /v2/report/bandlab_user/{userID}">client.ai.<a href="./src/resources/ai/ai.ts">reportBandlabUser</a>(userID) -> unknown</code>

# AI Videos

Types:

- <code><a href="./src/resources/ai-videos.ts">VideoGenerationCost</a></code>
- <code><a href="./src/resources/ai-videos.ts">VideoGenerationJob</a></code>
- <code><a href="./src/resources/ai-videos.ts">VisualStyle</a></code>
- <code><a href="./src/resources/ai-videos.ts">VisualStyleListResult</a></code>
- <code><a href="./src/resources/ai-videos.ts">VideoGenerationUnseenUpdates</a></code>
- <code><a href="./src/resources/ai-videos.ts">VideoGenerationJobList</a></code>

Methods:

- <code title="get /ai-videos/ai-tokens/price">client.aiVideos.<a href="./src/resources/ai-videos.ts">retrieveTokenPrice</a>() -> VideoGenerationCost</code>
- <code title="post /ai-videos/generate">client.aiVideos.<a href="./src/resources/ai-videos.ts">generate</a>({ ...params }) -> unknown</code>
- <code title="get /ai-videos/jobs">client.aiVideos.<a href="./src/resources/ai-videos.ts">listJobs</a>({ ...params }) -> VideoGenerationJobList</code>
- <code title="get /ai-videos/styles">client.aiVideos.<a href="./src/resources/ai-videos.ts">listStyles</a>({ ...params }) -> VisualStyleListResult</code>
- <code title="get /ai-videos/updates">client.aiVideos.<a href="./src/resources/ai-videos.ts">listUpdates</a>({ ...params }) -> VideoGenerationUnseenUpdates</code>

# Synced Lyrics

Types:

- <code><a href="./src/resources/synced-lyrics.ts">SyncedLyricPrice</a></code>
- <code><a href="./src/resources/synced-lyrics.ts">SyncedLyricsLyrics</a></code>
- <code><a href="./src/resources/synced-lyrics.ts">SyncedLyricResponse</a></code>

Methods:

- <code title="get /synced-lyrics/ai-tokens/price">client.syncedLyrics.<a href="./src/resources/synced-lyrics.ts">retrieveTokenPrice</a>() -> SyncedLyricPrice</code>
- <code title="get /synced-lyrics/{postID}">client.syncedLyrics.<a href="./src/resources/synced-lyrics.ts">retrieve</a>(postID) -> SyncedLyricResponse</code>

# Misc

Types:

- <code><a href="./src/resources/misc.ts">ChatWebSocketsUrl</a></code>
- <code><a href="./src/resources/misc.ts">BeatsFilters</a></code>
- <code><a href="./src/resources/misc.ts">SocialLink</a></code>
- <code><a href="./src/resources/misc.ts">SocialLinkList</a></code>

Methods:

- <code title="post /chat/authorizations">client.misc.<a href="./src/resources/misc.ts">createChatAuthorization</a>({ ...params }) -> ChatWebSocketsUrl</code>
- <code title="get /experiment/beats-filters">client.misc.<a href="./src/resources/misc.ts">retrieveBeatsFilters</a>() -> BeatsFilters</code>
- <code title="get /options">client.misc.<a href="./src/resources/misc.ts">retrieveOptions</a>() -> unknown</code>
- <code title="get /social-links">client.misc.<a href="./src/resources/misc.ts">listSocialLinks</a>({ ...params }) -> SocialLinkList</code>
- <code title="post /tracking/v2/collect">client.misc.<a href="./src/resources/misc.ts">collectTracking</a>({ ...params }) -> unknown</code>

# Tracks

Methods:

- <code title="get /tracks/{trackID}/artist">client.tracks.<a href="./src/resources/tracks.ts">retrieveArtist</a>(trackID) -> RevisionsAPI.Artist</code>
- <code title="get /tracks/{trackID}">client.tracks.<a href="./src/resources/tracks.ts">retrieveDownload</a>(trackID, { ...params }) -> RevisionsAPI.SampleUri</code>

# Streaks

Types:

- <code><a href="./src/resources/streaks.ts">FeedStreaksData</a></code>

Methods:

- <code title="post /streaks/enroll">client.streaks.<a href="./src/resources/streaks.ts">enroll</a>({ ...params }) -> void</code>
- <code title="get /streaks/me">client.streaks.<a href="./src/resources/streaks.ts">retrieve</a>() -> FeedStreaksData</code>
- <code title="post /streaks/streak-lost-notified">client.streaks.<a href="./src/resources/streaks.ts">markLostNotified</a>({ ...params }) -> void</code>

# Membership

Types:

- <code><a href="./src/resources/membership.ts">TokensBalanceDTO</a></code>
- <code><a href="./src/resources/membership.ts">MembershipStatusShort</a></code>
- <code><a href="./src/resources/membership.ts">SurveyQuestion</a></code>
- <code><a href="./src/resources/membership.ts">MembershipStatus</a></code>
- <code><a href="./src/resources/membership.ts">AiTokenBalance</a></code>

Methods:

- <code title="get /coins/users/{userID}/ai-tokens/balance">client.membership.<a href="./src/resources/membership.ts">retrieveCoinsTokenBalance</a>(userID) -> TokensBalanceDTO</code>
- <code title="get /experiment/users/{userID}/membership-status">client.membership.<a href="./src/resources/membership.ts">retrieveStatus</a>(userID) -> MembershipStatusShort</code>
- <code title="get /membership/surveys/{surveyID}">client.membership.<a href="./src/resources/membership.ts">retrieveSurvey</a>(surveyID) -> SurveyQuestion</code>
- <code title="post /membership/surveys/{surveyID}/answers">client.membership.<a href="./src/resources/membership.ts">submitSurveyAnswers</a>(surveyID, { ...params }) -> void</code>
- <code title="get /users/{userID}/membership-plan">client.membership.<a href="./src/resources/membership.ts">retrievePlan</a>(userID) -> MembershipStatus</code>
- <code title="get /wallet/users/{userID}/balances/ai-tokens">client.membership.<a href="./src/resources/membership.ts">retrieveWalletTokenBalance</a>(userID) -> AiTokenBalance</code>

# Payments

Types:

- <code><a href="./src/resources/payments.ts">PaymentIntent</a></code>
- <code><a href="./src/resources/payments.ts">SubsPurchaseStamp</a></code>

Methods:

- <code title="post /checkout/products/beats/payment-providers/google-play-store/payment-intents">client.payments.<a href="./src/resources/payments.ts">createBeatPaymentIntent</a>({ ...params }) -> PaymentIntent</code>
- <code title="post /checkout/products/boost-profile/payment-providers/google-play-store/payment-intents">client.payments.<a href="./src/resources/payments.ts">createBoostProfilePaymentIntent</a>({ ...params }) -> PaymentIntent</code>
- <code title="post /checkout/products/boost/payment-providers/google-play-store/payment-intents">client.payments.<a href="./src/resources/payments.ts">createBoostPaymentIntent</a>({ ...params }) -> PaymentIntent</code>
- <code title="post /checkout/products/membership/payment-providers/google-play-store/payment-intents">client.payments.<a href="./src/resources/payments.ts">createMembershipPaymentIntent</a>({ ...params }) -> SubsPurchaseStamp</code>
- <code title="post /checkout/products/membership/payment-providers/google-play-store/payment-intents/{paymentIntentID}/payment-confirmations">client.payments.<a href="./src/resources/payments.ts">confirmMembershipPayment</a>(paymentIntentID, { ...params }) -> MembershipStatus</code>
- <code title="post /checkout/products/{product}/payment-providers/google-play-store/payment-intents/{paymentIntentID}/payment-confirmations">client.payments.<a href="./src/resources/payments.ts">confirmPayment</a>(paymentIntentID, { ...params }) -> void</code>

# Beats

Types:

- <code><a href="./src/resources/beats.ts">Beat</a></code>
- <code><a href="./src/resources/beats.ts">BeatList</a></code>
- <code><a href="./src/resources/beats.ts">BeatsCollection</a></code>
- <code><a href="./src/resources/beats.ts">BeatsCollectionList</a></code>
- <code><a href="./src/resources/beats.ts">FreeBeatsQuota</a></code>
- <code><a href="./src/resources/beats.ts">BeatUserPreferences</a></code>

Methods:

- <code title="get /beats">client.beats.<a href="./src/resources/beats.ts">list</a>({ ...params }) -> BeatList</code>
- <code title="get /beats/collections">client.beats.<a href="./src/resources/beats.ts">listCollections</a>({ ...params }) -> BeatsCollectionList</code>
- <code title="get /beats/collections/{collectionID}">client.beats.<a href="./src/resources/beats.ts">retrieveCollection</a>(collectionID) -> BeatsCollection</code>
- <code title="get /beats/free-beats">client.beats.<a href="./src/resources/beats.ts">listFree</a>({ ...params }) -> BeatList</code>
- <code title="get /beats/genres/{genreID}">client.beats.<a href="./src/resources/beats.ts">listByGenre</a>(genreID, { ...params }) -> BeatList</code>
- <code title="get /beats/limited-beats">client.beats.<a href="./src/resources/beats.ts">listLimited</a>({ ...params }) -> BeatList</code>
- <code title="get /beats/members-only-beats">client.beats.<a href="./src/resources/beats.ts">listMembersOnly</a>({ ...params }) -> BeatList</code>
- <code title="get /beats/promo-carousels/{promoCampaignID}">client.beats.<a href="./src/resources/beats.ts">listPromoCarousel</a>(promoCampaignID, { ...params }) -> BeatList</code>
- <code title="get /beats/promo-header-beats">client.beats.<a href="./src/resources/beats.ts">listPromoHeader</a>({ ...params }) -> BeatList</code>
- <code title="post /beats/{beatID}/free-claims">client.beats.<a href="./src/resources/beats.ts">claimFree</a>(beatID, { ...params }) -> void</code>
- <code title="get /experiment/beats/{beatID}">client.beats.<a href="./src/resources/beats.ts">retrieve</a>(beatID) -> Beat</code>
- <code title="get /users/{userID}/beats/daily-free-quota">client.beats.<a href="./src/resources/beats.ts">retrieveDailyFreeQuota</a>(userID) -> FreeBeatsQuota</code>
- <code title="put /users/{userId}/beats/played/{beatID}">client.beats.<a href="./src/resources/beats.ts">markPlayed</a>(beatID, { ...params }) -> void</code>
- <code title="get /users/{userID}/beats/preferences">client.beats.<a href="./src/resources/beats.ts">retrievePreferences</a>(userID) -> BeatUserPreferences</code>
- <code title="get /users/{userID}/beats/preferred">client.beats.<a href="./src/resources/beats.ts">listPreferred</a>(userID, { ...params }) -> BeatList</code>
- <code title="put /users/{userId}/beats/saved/{beatID}">client.beats.<a href="./src/resources/beats.ts">save</a>(beatID, { ...params }) -> void</code>

# Distro

Types:

- <code><a href="./src/resources/distro.ts">AiGalleryItem</a></code>
- <code><a href="./src/resources/distro.ts">AiGalleryItemList</a></code>
- <code><a href="./src/resources/distro.ts">ArtistProfiles</a></code>
- <code><a href="./src/resources/distro.ts">FormOptions</a></code>
- <code><a href="./src/resources/distro.ts">DistroProject</a></code>
- <code><a href="./src/resources/distro.ts">DistroProjectList</a></code>
- <code><a href="./src/resources/distro.ts">DistroQuotas</a></code>
- <code><a href="./src/resources/distro.ts">CreateReleaseDetailsResponse</a></code>
- <code><a href="./src/resources/distro.ts">ReleaseDetails</a></code>
- <code><a href="./src/resources/distro.ts">GenerateCoversResponse</a></code>
- <code><a href="./src/resources/distro.ts">UpdateReleaseCoverArtResponse</a></code>
- <code><a href="./src/resources/distro.ts">UpdatedReleaseSongs</a></code>
- <code><a href="./src/resources/distro.ts">UserRevisions</a></code>
- <code><a href="./src/resources/distro.ts">InitiateUploadResponse</a></code>

Methods:

- <code title="get /users/{userID}/distro">client.distro.<a href="./src/resources/distro.ts">retrieveOverview</a>(userID) -> unknown</code>
- <code title="get /users/{userID}/distro/ai-covers">client.distro.<a href="./src/resources/distro.ts">listAiCovers</a>(userID, { ...params }) -> AiGalleryItemList</code>
- <code title="get /users/{userID}/distro/artist-profiles">client.distro.<a href="./src/resources/distro.ts">retrieveArtistProfiles</a>(userID) -> ArtistProfiles</code>
- <code title="get /users/{userID}/distro/form-options">client.distro.<a href="./src/resources/distro.ts">retrieveFormOptions</a>(userID) -> FormOptions</code>
- <code title="get /users/{userID}/distro/projects">client.distro.<a href="./src/resources/distro.ts">listProjects</a>(userID, { ...params }) -> DistroProjectList</code>
- <code title="get /users/{userID}/distro/quotas">client.distro.<a href="./src/resources/distro.ts">retrieveQuotas</a>(userID) -> DistroQuotas</code>
- <code title="post /users/{userID}/distro/releases">client.distro.<a href="./src/resources/distro.ts">createRelease</a>(userID, { ...params }) -> CreateReleaseDetailsResponse</code>
- <code title="get /users/{userId}/distro/releases/{releaseID}">client.distro.<a href="./src/resources/distro.ts">retrieveRelease</a>(releaseID, { ...params }) -> ReleaseDetails</code>
- <code title="post /users/{userId}/distro/releases/{releaseID}/ai-covers">client.distro.<a href="./src/resources/distro.ts">generateAiCovers</a>(releaseID, { ...params }) -> GenerateCoversResponse</code>
- <code title="post /users/{userId}/distro/releases/{releaseId}/ai-covers/{pictureID}">client.distro.<a href="./src/resources/distro.ts">selectAiCover</a>(pictureID, { ...params }) -> void</code>
- <code title="put /users/{userId}/distro/releases/{releaseID}/cover-art">client.distro.<a href="./src/resources/distro.ts">updateCoverArt</a>(releaseID, { ...params }) -> UpdateReleaseCoverArtResponse</code>
- <code title="put /users/{userId}/distro/releases/{releaseID}/songs">client.distro.<a href="./src/resources/distro.ts">updateSongs</a>(releaseID, { ...params }) -> UpdatedReleaseSongs</code>
- <code title="put /users/{userId}/distro/releases/{releaseID}/state">client.distro.<a href="./src/resources/distro.ts">updateReleaseState</a>(releaseID, { ...params }) -> void</code>
- <code title="get /users/{userID}/distro/revisions">client.distro.<a href="./src/resources/distro.ts">listRevisions</a>(userID) -> UserRevisions</code>
- <code title="post /users/{userID}/distro/uploads">client.distro.<a href="./src/resources/distro.ts">createUpload</a>(userID, { ...params }) -> InitiateUploadResponse</code>

# Promote

Types:

- <code><a href="./src/resources/promote.ts">BeatsMemPromo</a></code>
- <code><a href="./src/resources/promote.ts">BeatsMemPromoList</a></code>
- <code><a href="./src/resources/promote.ts">OpportunitiesBanner</a></code>
- <code><a href="./src/resources/promote.ts">OpportunitiesBannerList</a></code>
- <code><a href="./src/resources/promote.ts">BoostCredits</a></code>
- <code><a href="./src/resources/promote.ts">SubscriberState</a></code>
- <code><a href="./src/resources/promote.ts">UserPayoutMethodRequired</a></code>
- <code><a href="./src/resources/promote.ts">PackSectionsDto</a></code>
- <code><a href="./src/resources/promote.ts">FxPromoCampaign</a></code>
- <code><a href="./src/resources/promote.ts">FxPromoCampaignList</a></code>
- <code><a href="./src/resources/promote.ts">AvailablePromoCarousel</a></code>
- <code><a href="./src/resources/promote.ts">AvailablePromoCarouselList</a></code>

Methods:

- <code title="get /beats-promo-banners">client.promote.<a href="./src/resources/promote.ts">listBeatsPromoBanners</a>({ ...params }) -> BeatsMemPromoList</code>
- <code title="get /populated-opportunities-banners">client.promote.<a href="./src/resources/promote.ts">listOpportunitiesBanners</a>({ ...params }) -> OpportunitiesBannerList</code>
- <code title="get /users/{userID}/boost-credits">client.promote.<a href="./src/resources/promote.ts">retrieveBoostCredits</a>(userID) -> BoostCredits</code>
- <code title="get /users/{userId}/fan-reach/fans/{initiatorID}">client.promote.<a href="./src/resources/promote.ts">retrieveFanReach</a>(initiatorID, { ...params }) -> SubscriberState</code>
- <code title="get /users/{userID}/payout-methods/tipalti/balance">client.promote.<a href="./src/resources/promote.ts">retrievePayoutBalance</a>(userID) -> unknown</code>
- <code title="get /users/{userID}/payout/method-required">client.promote.<a href="./src/resources/promote.ts">retrievePayoutMethodRequired</a>(userID) -> UserPayoutMethodRequired</code>
- <code title="get /users/{userID}/promo">client.promote.<a href="./src/resources/promote.ts">retrievePromo</a>(userID, { ...params }) -> PackSectionsDto</code>
- <code title="get /users/{userID}/promo-campaigns">client.promote.<a href="./src/resources/promote.ts">listPromoCampaigns</a>(userID, { ...params }) -> FxPromoCampaignList</code>
- <code title="get /users/{userID}/promo-campaigns">client.promote.<a href="./src/resources/promote.ts">listBeatsCarouselCampaigns</a>(userID) -> AvailablePromoCarouselList</code>

# Pages

Types:

- <code><a href="./src/resources/pages.ts">DuplicateSongResponse</a></code>
- <code><a href="./src/resources/pages.ts">BioPage</a></code>
- <code><a href="./src/resources/pages.ts">BioPageState</a></code>

Methods:

- <code title="post /projects/{projectID}/duplicates">client.pages.<a href="./src/resources/pages.ts">duplicateProject</a>(projectID, { ...params }) -> DuplicateSongResponse</code>
- <code title="get /users/{userID}/pages/bio">client.pages.<a href="./src/resources/pages.ts">retrieveBio</a>(userID) -> BioPage</code>
- <code title="get /users/{userID}/pages/bio/state">client.pages.<a href="./src/resources/pages.ts">retrieveBioState</a>(userID) -> BioPageState</code>

# Library

Types:

- <code><a href="./src/resources/library.ts">Beat</a></code>
- <code><a href="./src/resources/library.ts">BeatList</a></code>
- <code><a href="./src/resources/library.ts">CollectionDto</a></code>
- <code><a href="./src/resources/library.ts">PlaybackHistory</a></code>
- <code><a href="./src/resources/library.ts">PlaybackHistoryList</a></code>
- <code><a href="./src/resources/library.ts">PlaylistCollection</a></code>
- <code><a href="./src/resources/library.ts">PlaylistCollectionList</a></code>
- <code><a href="./src/resources/library.ts">RecommendedArtist</a></code>
- <code><a href="./src/resources/library.ts">RecommendedArtistList</a></code>
- <code><a href="./src/resources/library.ts">SoundsPacksDto</a></code>

Methods:

- <code title="get /users/{userID}/likes/collections">client.library.<a href="./src/resources/library.ts">listLikedCollections</a>(userID, { ...params }) -> PlaylistCollectionList</code>
- <code title="get /users/{userID}/likes/posts">client.library.<a href="./src/resources/library.ts">listLikedPosts</a>(userID, { ...params }) -> PostsAPI.PostList</code>
- <code title="get /users/{userID}/likes/albums">client.library.<a href="./src/resources/library.ts">listLikedAlbums</a>(userID, { ...params }) -> AlbumsAPI.AlbumList</code>
- <code title="get /users/{userID}/purchases/albums">client.library.<a href="./src/resources/library.ts">listPurchasedAlbums</a>(userID, { ...params }) -> AlbumsAPI.AlbumList</code>
- <code title="get /experiment/users/{userID}/purchases/beats">client.library.<a href="./src/resources/library.ts">listPurchasedBeats</a>(userID, { ...params }) -> BeatList</code>
- <code title="get /users/{userID}/library/track-posts">client.library.<a href="./src/resources/library.ts">listTrackPosts</a>(userID, { ...params }) -> PostsAPI.PostList</code>
- <code title="get /users/{userID}/pins/posts">client.library.<a href="./src/resources/library.ts">listPinnedPosts</a>(userID, { ...params }) -> PostsAPI.PostList</code>
- <code title="post /users/{userId}/pins/posts/{postID}">client.library.<a href="./src/resources/library.ts">pinPost</a>(postID, { ...params }) -> void</code>
- <code title="get /users/{userID}/posts-playback-history">client.library.<a href="./src/resources/library.ts">listPlaybackHistory</a>(userID, { ...params }) -> PlaybackHistoryList</code>
- <code title="delete /users/{userId}/playback-history/posts/{postID}">client.library.<a href="./src/resources/library.ts">deletePlaybackHistory</a>(postID, { ...params }) -> void</code>
- <code title="get /users/{userID}/recommendations/track-posts">client.library.<a href="./src/resources/library.ts">listRecommendedTrackPosts</a>(userID, { ...params }) -> PostsAPI.PostList</code>
- <code title="get /users/{userID}/recommendations/follow-back/artists">client.library.<a href="./src/resources/library.ts">listRecommendedArtists</a>(userID, { ...params }) -> RecommendedArtistList</code>
- <code title="get /users/{userID}/recommendations/packs">client.library.<a href="./src/resources/library.ts">listRecommendedPacks</a>(userID, { ...params }) -> SoundsPacksDto</code>
- <code title="put /users/{userId}/collections/{collectionID}/{sampleId}">client.library.<a href="./src/resources/library.ts">addSampleToCollection</a>(collectionID, { ...params }) -> CollectionDto</code>
- <code title="put /users/{userId}/collections/{collectionID}">client.library.<a href="./src/resources/library.ts">updateCollection</a>(collectionID, { ...params }) -> CollectionDto</code>

# Feeds

Types:

- <code><a href="./src/resources/feeds.ts">FeaturedBand</a></code>
- <code><a href="./src/resources/feeds.ts">FeaturedBandList</a></code>
- <code><a href="./src/resources/feeds.ts">SamplerKitDTO</a></code>
- <code><a href="./src/resources/feeds.ts">SamplerKitDTOList</a></code>
- <code><a href="./src/resources/feeds.ts">Section</a></code>
- <code><a href="./src/resources/feeds.ts">SectionList</a></code>

Methods:

- <code title="get /users/{userID}/feeds/for-you/posts">client.feeds.<a href="./src/resources/feeds.ts">retrieveForYou</a>(userID, { ...params }) -> PostsAPI.PostList</code>
- <code title="get /users/{userID}/feeds/following/posts">client.feeds.<a href="./src/resources/feeds.ts">listFollowing</a>(userID, { ...params }) -> PostsAPI.PostList</code>
- <code title="get /users/{userID}/feeds/media/posts">client.feeds.<a href="./src/resources/feeds.ts">listMedia</a>(userID, { ...params }) -> PostsAPI.PostList</code>
- <code title="get /users/{userID}/feeds/trending/posts">client.feeds.<a href="./src/resources/feeds.ts">listTrending</a>(userID, { ...params }) -> PostsAPI.PostList</code>
- <code title="put /users/{id}/feeds/trending/hidden-creators/{creatorID}">client.feeds.<a href="./src/resources/feeds.ts">hideTrendingCreator</a>(creatorID, { ...params }) -> void</code>
- <code title="get /experiment/feeds/communities/posts">client.feeds.<a href="./src/resources/feeds.ts">listCommunities</a>({ ...params }) -> PostsAPI.PostList</code>
- <code title="get /feeds/trending/videos/posts">client.feeds.<a href="./src/resources/feeds.ts">listTrendingVideos</a>({ ...params }) -> PostsAPI.PostList</code>
- <code title="get /recommendations/posts">client.feeds.<a href="./src/resources/feeds.ts">listRecommendedPosts</a>({ ...params }) -> PostsAPI.PostList</code>
- <code title="get /explore/featured-bands">client.feeds.<a href="./src/resources/feeds.ts">listFeaturedBands</a>({ ...params }) -> FeaturedBandList</code>
- <code title="get /explore/recommended-albums">client.feeds.<a href="./src/resources/feeds.ts">listRecommendedAlbums</a>({ ...params }) -> AlbumsAPI.AlbumList</code>
- <code title="get /explore/trending-videos/posts">client.feeds.<a href="./src/resources/feeds.ts">listExploreTrendingVideos</a>({ ...params }) -> PostsAPI.PostList</code>
- <code title="get /explore/multipadsampler/sections">client.feeds.<a href="./src/resources/feeds.ts">listSamplerSections</a>({ ...params }) -> SamplerKitDTOList</code>
- <code title="get /explore/{features}/sections">client.feeds.<a href="./src/resources/feeds.ts">listSections</a>(features, { ...params }) -> SectionList</code>

# Messaging

Types:

- <code><a href="./src/resources/messaging/messaging.ts">ChatCount</a></code>
- <code><a href="./src/resources/messaging/messaging.ts">ChatMediaInitUploadResponse</a></code>
- <code><a href="./src/resources/messaging/messaging.ts">ChatMember</a></code>
- <code><a href="./src/resources/messaging/messaging.ts">ChatMemberList</a></code>
- <code><a href="./src/resources/messaging/messaging.ts">ChatMessage</a></code>
- <code><a href="./src/resources/messaging/messaging.ts">ChatMessageList</a></code>
- <code><a href="./src/resources/messaging/messaging.ts">Conversation</a></code>
- <code><a href="./src/resources/messaging/messaging.ts">ConversationList</a></code>
- <code><a href="./src/resources/messaging/messaging.ts">MemberReactionDTO</a></code>
- <code><a href="./src/resources/messaging/messaging.ts">MemberReactionDTOList</a></code>
- <code><a href="./src/resources/messaging/messaging.ts">MemberReadTimeDTO</a></code>
- <code><a href="./src/resources/messaging/messaging.ts">MemberReadTimeDTOList</a></code>

## Conversations

Methods:

- <code title="get /users/{currentUserID}/conversations">client.messaging.conversations.<a href="./src/resources/messaging/messaging.ts">list</a>(currentUserID, { ...params }) -> ConversationList</code>
- <code title="get /users/{currentUserId}/conversations/{conversationID}">client.messaging.conversations.<a href="./src/resources/messaging/messaging.ts">retrieve</a>(conversationID, { ...params }) -> Conversation</code>
- <code title="delete /users/{currentUserID}/conversations">client.messaging.conversations.<a href="./src/resources/messaging/messaging.ts">delete</a>(currentUserID, { ...params }) -> void</code>
- <code title="get /users/{currentUserID}/conversations/hidden">client.messaging.conversations.<a href="./src/resources/messaging/messaging.ts">listHidden</a>(currentUserID) -> ConversationList</code>
- <code title="get /users/{currentUserID}/conversations/count">client.messaging.conversations.<a href="./src/resources/messaging/messaging.ts">count</a>(currentUserID, { ...params }) -> ChatCount</code>

## Channels

Methods:

- <code title="get /users/{currentUserId}/chat/channels/{channelID}">client.messaging.channels.<a href="./src/resources/messaging/messaging.ts">retrieve</a>(channelID, { ...params }) -> Conversation</code>
- <code title="get /users/{currentUserId}/chat/channels/{channelID}/messages">client.messaging.channels.<a href="./src/resources/messaging/messaging.ts">listMessages</a>(channelID, { ...params }) -> ChatMessageList</code>

## Attachments

Methods:

- <code title="post /conversations/{conversationID}/attachments/initialize-upload">client.messaging.conversations.attachments.<a href="./src/resources/messaging/messaging.ts">initializeUpload</a>(conversationID, { ...params }) -> ChatMediaInitUploadResponse</code>
- <code title="put /conversations/{conversationId}/attachments/{attachmentID}/complete-upload">client.messaging.conversations.attachments.<a href="./src/resources/messaging/messaging.ts">completeUpload</a>(attachmentID, { ...params }) -> void</code>
- <code title="get /conversations/{conversationId}/attachments/{attachmentID}/upload-state">client.messaging.conversations.attachments.<a href="./src/resources/messaging/messaging.ts">retrieveUploadState</a>(attachmentID, { ...params }) -> UploadsAPI.FileUploadSession</code>

## Blocks

Methods:

- <code title="post /conversations/{conversationId}/blocks/members/{memberID}">client.messaging.conversations.blocks.<a href="./src/resources/messaging/messaging.ts">blockMember</a>(memberID, { ...params }) -> void</code>

## Members

Methods:

- <code title="get /conversations/{conversationID}/members">client.messaging.conversations.members.<a href="./src/resources/messaging/messaging.ts">list</a>(conversationID) -> ChatMemberList</code>
- <code title="get /conversations/{conversationId}/members/{memberID}">client.messaging.conversations.members.<a href="./src/resources/messaging/messaging.ts">retrieve</a>(memberID, { ...params }) -> ChatMember</code>

## Messages

Methods:

- <code title="get /users/{currentUserId}/conversations/{conversationID}/messages">client.messaging.conversations.messages.<a href="./src/resources/messaging/messaging.ts">list</a>(conversationID, { ...params }) -> ChatMessageList</code>
- <code title="delete /users/{currentUserId}/conversations/{conversationId}/messages/{messageID}">client.messaging.conversations.messages.<a href="./src/resources/messaging/messaging.ts">delete</a>(messageID, { ...params }) -> void</code>
- <code title="get /users/{currentUserId}/conversations/{conversationId}/messages/{messageID}/reactions">client.messaging.conversations.messages.<a href="./src/resources/messaging/messaging.ts">listReactions</a>(messageID, { ...params }) -> MemberReactionDTOList</code>
- <code title="post /users/{currentUserId}/conversations/{conversationId}/messages/{messageID}/receipts/read">client.messaging.conversations.messages.<a href="./src/resources/messaging/messaging.ts">markRead</a>(messageID, { ...params }) -> void</code>

## Read Receipts

Methods:

- <code title="get /users/{currentUserId}/conversations/{conversationID}/read-receipts">client.messaging.conversations.readReceipts.<a href="./src/resources/messaging/messaging.ts">list</a>(conversationID, { ...params }) -> MemberReadTimeDTOList</code>
