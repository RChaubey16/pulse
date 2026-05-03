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


