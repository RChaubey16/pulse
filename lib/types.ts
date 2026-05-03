export interface TemplateField {
  name: string;
  required: boolean;
  description: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  subject: string;
  fields: TemplateField[];
}

export interface UserTemplate {
  id: string;
  userId: string;
  name: string;
  subject: string;
  html: string;
  createdAt: string;
  updatedAt: string;
}

