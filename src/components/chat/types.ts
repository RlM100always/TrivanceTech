export interface ChatMessage {
  seq: number;
  id: string;
  conversation_id: string;
  sender_type: 'client' | 'admin';
  sender_email: string;
  sender_name: string;
  body: string;
  drive_file_id: string | null;
  drive_file_name: string | null;
  read_at: string | null;
  edited_at: string | null;
  deleted_at: string | null;
  updated_at: string;
  created_at: string;
}

export interface MessagesResponse {
  messages: ChatMessage[];
  serverTime: string;
}
