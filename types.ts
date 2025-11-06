
export type SurveyData = {
  visitorName: string;
  visitorDepartment: string;
  answers: Record<string, string | number | null>; // key is question id
};

export type SurveyResponse = {
  id: string; // UUID
  project_id: string; // UUID
  created_at: string;
  visitor_name: string;
  visitor_department: string;
  answers: Record<string, string | number | null>;
};

export type Project = {
  id: string; // UUID
  created_at: string;
  name: string;
  description: string;
  image_url: string;
  project_url: string;
};

export type QuestionType = 'text' | 'textarea' | 'rating' | 'radio';

export type SurveyQuestion = {
  id: string; // UUID
  created_at: string;
  label: string;
  type: QuestionType;
  description?: string;
  options?: { value: string; label: string }[];
  required: boolean;
  placeholder?: string;
  display_order: number;
};

export type ToastType = 'success' | 'error';

export type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
};