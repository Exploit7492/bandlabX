// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as UploadsAPI from '../uploads';
import * as FollowersAPI from '../users/followers';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Messaging extends APIResource {
  conversations: Conversations = new Conversations(this._client);
  channels: Channels = new Channels(this._client);
}

export class Conversations extends APIResource {
  attachments: Attachments = new Attachments(this._client);
  blocks: Blocks = new Blocks(this._client);
  members: Members = new Members(this._client);
  messages: Messages = new Messages(this._client);
  readReceipts: ReadReceipts = new ReadReceipts(this._client);

  /**
   * Returns the current user's conversations
   *
   * Evidence: `apk` — `ChatService`, `GET users/{currentUserId}/conversations`. Response typed from
   * `com.bandlab.chat.objects.Conversation`.
   */
  list(
    currentUserID: string,
    query: ConversationListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ConversationList> {
    return this._client.get(path`/users/${currentUserID}/conversations`, { query, ...options });
  }

  /**
   * Returns a single conversation
   *
   * Evidence: `apk` — `ChatService`, `GET users/{currentUserId}/conversations/{conversationId}`.
   * Response typed from `com.bandlab.chat.objects.Conversation`.
   */
  retrieve(
    conversationID: string,
    params: ConversationRetrieveParams,
    options?: RequestOptions,
  ): APIPromise<Conversation> {
    const { currentUserId } = params;
    return this._client.get(path`/users/${currentUserId}/conversations/${conversationID}`, options);
  }

  /**
   * Deletes the current user's accepted conversations
   *
   * Evidence: `apk` — `ChatService`, `DELETE users/{currentUserId}/conversations?isAccepted=false`.
   * The app always sends `isAccepted=false`.
   */
  delete(
    currentUserID: string,
    query: ConversationDeleteParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.delete(path`/users/${currentUserID}/conversations`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns the current user's hidden conversations
   *
   * Evidence: `apk` — `ChatService`, `GET users/{currentUserId}/conversations/hidden`. Response
   * typed from `com.bandlab.chat.objects.Conversation`.
   */
  listHidden(currentUserID: string, options?: RequestOptions): APIPromise<ConversationList> {
    return this._client.get(path`/users/${currentUserID}/conversations/hidden`, options);
  }

  /**
   * Returns a conversation count
   *
   * Evidence: `apk` — `ChatService`, `GET users/{currentUserId}/conversations/count?isAccepted=false`
   * and `?isRead=false`. Response typed from `com.bandlab.chat.objects.ChatCount`.
   */
  count(
    currentUserID: string,
    query: ConversationCountParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ChatCount> {
    return this._client.get(path`/users/${currentUserID}/conversations/count`, { query, ...options });
  }
}

export class Channels extends APIResource {
  /**
   * Returns a chat channel
   *
   * Evidence: `apk` — `ChatService`, `GET users/{currentUserId}/chat/channels/{channelId}`.
   * Response typed from `com.bandlab.chat.objects.Conversation`.
   */
  retrieve(
    channelID: string,
    params: ChannelRetrieveParams,
    options?: RequestOptions,
  ): APIPromise<Conversation> {
    const { currentUserId } = params;
    return this._client.get(path`/users/${currentUserId}/chat/channels/${channelID}`, options);
  }

  /**
   * Returns the messages in a chat channel
   *
   * Evidence: `apk` — `ChatService`, `GET users/{currentUserId}/chat/channels/{channelId}/messages`.
   * Response typed from `com.bandlab.chat.objects.ChatMessage`.
   */
  listMessages(
    channelID: string,
    params: ChannelListMessagesParams,
    options?: RequestOptions,
  ): APIPromise<ChatMessageList> {
    const { currentUserId, ...query } = params;
    return this._client.get(path`/users/${currentUserId}/chat/channels/${channelID}/messages`, {
      query,
      ...options,
    });
  }
}

export class Attachments extends APIResource {
  /**
   * Initialises a conversation attachment upload
   *
   * Evidence: `apk` — `ChatAttachmentsService`,
   * `POST conversations/{conversationId}/attachments/initialize-upload`. Response typed from
   * `com.bandlab.chat.objects.ChatMediaInitUploadResponse`. The request body model is not in the
   * descriptor set, so the body is `unknown` under rule D12.
   */
  initializeUpload(
    conversationID: string,
    body: unknown,
    options?: RequestOptions,
  ): APIPromise<ChatMediaInitUploadResponse> {
    return this._client.post(path`/conversations/${conversationID}/attachments/initialize-upload`, {
      body,
      ...options,
    });
  }

  /**
   * Completes a conversation attachment upload
   *
   * Evidence: `apk` — `ChatAttachmentsService`,
   * `PUT conversations/{conversationId}/attachments/{attachmentId}/complete-upload`. The request
   * body model is not in the descriptor set, so the body is `unknown` under rule D12.
   */
  completeUpload(
    attachmentID: string,
    params: AttachmentCompleteUploadParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { conversationId, ...body } = params;
    return this._client.put(
      path`/conversations/${conversationId}/attachments/${attachmentID}/complete-upload`,
      {
        body,
        ...options,
        headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
      },
    );
  }

  /**
   * Returns the state of a conversation attachment upload
   *
   * Evidence: `apk` — `ChatAttachmentsService`,
   * `GET conversations/{conversationId}/attachments/{attachmentId}/upload-state`. Response typed
   * from `com.bandlab.video.uploader.api.FileUploadSession`.
   */
  retrieveUploadState(
    attachmentID: string,
    params: AttachmentRetrieveUploadStateParams,
    options?: RequestOptions,
  ): APIPromise<UploadsAPI.FileUploadSession> {
    const { conversationId } = params;
    return this._client.get(
      path`/conversations/${conversationId}/attachments/${attachmentID}/upload-state`,
      options,
    );
  }
}

export class Blocks extends APIResource {
  /**
   * Blocks a member in a conversation
   *
   * Evidence: `apk` — `ChatService`, `POST conversations/{conversationId}/blocks/members/{memberId}`.
   */
  blockMember(memberID: string, params: BlockBlockMemberParams, options?: RequestOptions): APIPromise<void> {
    const { conversationId } = params;
    return this._client.post(path`/conversations/${conversationId}/blocks/members/${memberID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export class Members extends APIResource {
  /**
   * Returns the members of a conversation
   *
   * Evidence: `apk` — `ChatService`, `GET conversations/{conversationId}/members`. Response typed
   * from `com.bandlab.chat.objects.ChatMember`.
   */
  list(conversationID: string, options?: RequestOptions): APIPromise<ChatMemberList> {
    return this._client.get(path`/conversations/${conversationID}/members`, options);
  }

  /**
   * Returns a member of a conversation
   *
   * Evidence: `apk` — `ChatService`, `GET conversations/{conversationId}/members/{memberId}`.
   * Response typed from `com.bandlab.chat.objects.ChatMember`.
   */
  retrieve(memberID: string, params: MemberRetrieveParams, options?: RequestOptions): APIPromise<ChatMember> {
    const { conversationId } = params;
    return this._client.get(path`/conversations/${conversationId}/members/${memberID}`, options);
  }
}

export class Messages extends APIResource {
  /**
   * Returns the messages in a conversation
   *
   * Evidence: `apk` — `ChatService`,
   * `GET users/{currentUserId}/conversations/{conversationId}/messages`. Response typed from
   * `com.bandlab.chat.objects.ChatMessage`.
   */
  list(
    conversationID: string,
    params: MessageListParams,
    options?: RequestOptions,
  ): APIPromise<ChatMessageList> {
    const { currentUserId, ...query } = params;
    return this._client.get(path`/users/${currentUserId}/conversations/${conversationID}/messages`, {
      query,
      ...options,
    });
  }

  /**
   * Deletes a message
   *
   * Evidence: `apk` — `ChatService`,
   * `DELETE users/{currentUserId}/conversations/{conversationId}/messages/{messageId}`.
   */
  delete(messageID: string, params: MessageDeleteParams, options?: RequestOptions): APIPromise<void> {
    const { currentUserId, conversationId } = params;
    return this._client.delete(
      path`/users/${currentUserId}/conversations/${conversationId}/messages/${messageID}`,
      {
        ...options,
        headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
      },
    );
  }

  /**
   * Returns the reactions on a message
   *
   * Evidence: `apk` — `ChatService`,
   * `GET users/{currentUserId}/conversations/{conversationId}/messages/{messageId}/reactions`. Response
   * typed from `com.bandlab.chat.objects.MemberReactionDTO`.
   */
  listReactions(
    messageID: string,
    params: MessageListReactionsParams,
    options?: RequestOptions,
  ): APIPromise<MemberReactionDTOList> {
    const { currentUserId, conversationId } = params;
    return this._client.get(
      path`/users/${currentUserId}/conversations/${conversationId}/messages/${messageID}/reactions`,
      options,
    );
  }

  /**
   * Marks a message as read
   *
   * Evidence: `apk` — `ChatService`,
   * `POST users/{currentUserId}/conversations/{conversationId}/messages/{messageId}/receipts/read`.
   */
  markRead(messageID: string, params: MessageMarkReadParams, options?: RequestOptions): APIPromise<void> {
    const { currentUserId, conversationId } = params;
    return this._client.post(
      path`/users/${currentUserId}/conversations/${conversationId}/messages/${messageID}/receipts/read`,
      { ...options, headers: buildHeaders([{ Accept: '*/*' }, options?.headers]) },
    );
  }
}

export class ReadReceipts extends APIResource {
  /**
   * Returns the read receipts of a conversation
   *
   * Evidence: `apk` — `ChatService`,
   * `GET users/{currentUserId}/conversations/{conversationId}/read-receipts`. Response typed from
   * `com.bandlab.chat.objects.MemberReadTimeDTO`.
   */
  list(
    conversationID: string,
    params: ReadReceiptListParams,
    options?: RequestOptions,
  ): APIPromise<MemberReadTimeDTOList> {
    const { currentUserId } = params;
    return this._client.get(
      path`/users/${currentUserId}/conversations/${conversationID}/read-receipts`,
      options,
    );
  }
}

/**
 * Evidence: `apk` — `com.bandlab.chat.objects.ChatCount`.
 */
export interface ChatCount {
  count?: number;
}

/**
 * Evidence: `apk` — `com.bandlab.chat.objects.ChatMediaInitUploadResponse`.
 */
export interface ChatMediaInitUploadResponse {
  id?: string;

  parts?: Array<unknown>;

  previewUploadUrl?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.chat.objects.ChatMember`.
 */
export interface ChatMember {
  id?: string;

  username?: string;

  pictureId?: string;

  pictureModifiedOn?: string;

  picture?: unknown;

  isActive?: boolean;

  createdOn?: string;

  isCurrentConversationMember?: boolean;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.chat.objects.ChatMember`.
 */
export interface ChatMemberList {
  data?: Array<ChatMember>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.chat.objects.ChatMessage`.
 */
export interface ChatMessage {
  id?: string;

  title?: string;

  createdOn?: string;

  status?: string;

  type?: string;

  sender?: unknown;

  links?: unknown;

  messageContentType?: string;

  animation?: unknown;

  attachments?: unknown;

  attachmentType?: string;

  initiatorReaction?: unknown;

  reactions?: unknown;

  repliedMessage?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.chat.objects.ChatMessage`.
 */
export interface ChatMessageList {
  data?: Array<ChatMessage>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.chat.objects.Conversation`.
 */
export interface Conversation {
  id?: string;

  type?: string;

  previewMessage?: unknown;

  lastReadMessageId?: string;

  unreadMessageCount?: number;

  hasUnreadReaction?: boolean;

  isAccepted?: boolean;

  picture?: unknown;

  members?: unknown;

  user?: unknown;

  group?: unknown;

  permissions?: unknown;

  creator?: unknown;

  lastMessageSenderId?: string;

  lastMessageCreatedOn?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.chat.objects.Conversation`.
 */
export interface ConversationList {
  data?: Array<Conversation>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.chat.objects.MemberReactionDTO`.
 */
export interface MemberReactionDTO {
  memberId?: string;

  username?: string;

  picture?: unknown;

  reaction?: string;

  createdOn?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.chat.objects.MemberReactionDTO`.
 */
export interface MemberReactionDTOList {
  data?: Array<MemberReactionDTO>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.chat.objects.MemberReadTimeDTO`.
 */
export interface MemberReadTimeDTO {
  memberId?: string;

  lastReadOn?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.chat.objects.MemberReadTimeDTO`.
 */
export interface MemberReadTimeDTOList {
  data?: Array<MemberReadTimeDTO>;

  paging?: FollowersAPI.Paging;
}

export interface ConversationListParams {
  isAccepted?: boolean;

  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface ConversationRetrieveParams {
  currentUserId: string;
}

export interface ConversationDeleteParams {
  isAccepted?: boolean;
}

export interface ConversationCountParams {
  isAccepted?: boolean;

  isRead?: boolean;
}

export interface ChannelRetrieveParams {
  currentUserId: string;
}

export interface ChannelListMessagesParams {
  currentUserId: string;

  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AttachmentCompleteUploadParams {
  conversationId: string;
}

export interface AttachmentRetrieveUploadStateParams {
  conversationId: string;
}

export interface BlockBlockMemberParams {
  conversationId: string;
}

export interface MemberRetrieveParams {
  conversationId: string;
}

export interface MessageListParams {
  currentUserId: string;

  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface MessageDeleteParams {
  currentUserId: string;

  conversationId: string;
}

export interface MessageListReactionsParams {
  currentUserId: string;

  conversationId: string;
}

export interface MessageMarkReadParams {
  currentUserId: string;

  conversationId: string;
}

export interface ReadReceiptListParams {
  currentUserId: string;
}

Messaging.Conversations = Conversations;
Messaging.Channels = Channels;
Conversations.Attachments = Attachments;
Conversations.Blocks = Blocks;
Conversations.Members = Members;
Conversations.Messages = Messages;
Conversations.ReadReceipts = ReadReceipts;

export declare namespace Messaging {
  export {
    Conversations as Conversations,
    Channels as Channels,
    Attachments as Attachments,
    Blocks as Blocks,
    Members as Members,
    Messages as Messages,
    ReadReceipts as ReadReceipts,
    type ChatCount as ChatCount,
    type ChatMediaInitUploadResponse as ChatMediaInitUploadResponse,
    type ChatMember as ChatMember,
    type ChatMemberList as ChatMemberList,
    type ChatMessage as ChatMessage,
    type ChatMessageList as ChatMessageList,
    type Conversation as Conversation,
    type ConversationList as ConversationList,
    type MemberReactionDTO as MemberReactionDTO,
    type MemberReactionDTOList as MemberReactionDTOList,
    type MemberReadTimeDTO as MemberReadTimeDTO,
    type MemberReadTimeDTOList as MemberReadTimeDTOList,
    type ConversationListParams as ConversationListParams,
    type ConversationRetrieveParams as ConversationRetrieveParams,
    type ConversationDeleteParams as ConversationDeleteParams,
    type ConversationCountParams as ConversationCountParams,
    type ChannelRetrieveParams as ChannelRetrieveParams,
    type ChannelListMessagesParams as ChannelListMessagesParams,
    type AttachmentCompleteUploadParams as AttachmentCompleteUploadParams,
    type AttachmentRetrieveUploadStateParams as AttachmentRetrieveUploadStateParams,
    type BlockBlockMemberParams as BlockBlockMemberParams,
    type MemberRetrieveParams as MemberRetrieveParams,
    type MessageListParams as MessageListParams,
    type MessageDeleteParams as MessageDeleteParams,
    type MessageListReactionsParams as MessageListReactionsParams,
    type MessageMarkReadParams as MessageMarkReadParams,
    type ReadReceiptListParams as ReadReceiptListParams,
  };
}

export declare namespace Conversations {
  export {
    Attachments as Attachments,
    Blocks as Blocks,
    Members as Members,
    Messages as Messages,
    ReadReceipts as ReadReceipts,
  };
}
