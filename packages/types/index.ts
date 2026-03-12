// Shared types for LiveVolley

// ============================================================================
// USER
// ============================================================================

export interface IUser {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
}

export type UserRole = 'ADMIN' | 'MODERATOR' | 'COACH' | 'PLAYER' | 'SPECTATOR' | 'USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'SUSPENDED';

// ============================================================================
// MATCH & SCORE
// ============================================================================

export interface IMatch {
  id: string;
  title: string;
  competitionId: string;
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt: Date;
  status: MatchStatus;
  streamingUrl?: string;
  thumbnail?: string;
  createdAt: Date;
}

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export interface IScore {
  id: string;
  matchId: string;
  homeTeamScore: number;
  awayTeamScore: number;
  set: number;
  createdAt: Date;
}

// ============================================================================
// STREAMING
// ============================================================================

export interface IStreaming {
  id: string;
  matchId: string;
  title: string;
  status: StreamingStatus;
  viewers: number;
  hlsPlayback?: string;
  rtmpIngestion?: string;
}

export type StreamingStatus = 'SETUP' | 'LIVE' | 'RECORDING' | 'COMPLETED' | 'FAILED';

// ============================================================================
// CHAT
// ============================================================================

export interface IChatMessage {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  isEdited: boolean;
  isFlagged: boolean;
  createdAt: Date;
}

// ============================================================================
// WEBSOCKET EVENTS
// ============================================================================

export interface IWebSocketMessage {
  event: string;
  data: unknown;
  timestamp: Date;
}

// Score updated
export interface ScoreUpdateEvent {
  matchId: string;
  homeTeamScore: number;
  awayTeamScore: number;
  set: number;
}

// Chat message
export interface ChatMessageEvent {
  matchId: string;
  message: IChatMessage;
}

// Streaming status
export interface StreamingStatusEvent {
  matchId: string;
  status: StreamingStatus;
  viewers: number;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
