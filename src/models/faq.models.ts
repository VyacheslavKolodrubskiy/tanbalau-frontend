import type { JsonParser, SerializedData } from '@/types';
import { Parse } from '@/network/parse';
import { format } from '@/utils/format';

export interface IFaq {
  readonly id?: number
  question?: string
  answer?: string
  url?: string
  createdAt?: string
}

// Hack for combine destructuring with parameter properties
// https://github.com/microsoft/TypeScript/issues/5326
export interface Faq extends IFaq {}

export class Faq {
  constructor(props: IFaq) {
    Object.assign(this, props);
  }

  static fromJson: JsonParser<Faq> = (json) => {
    return new Faq({
      id: Parse.number(json.id),
      question: Parse.string(json.question),
      answer: Parse.string(json.answer),
      url: Parse.string(json.url),
      createdAt: format(Parse.string(json.created_at), 'date'),
    });
  };

  toJson(): SerializedData {
    return {
      question: this.question,
      answer: this.answer,
      url: this.url,
    };
  }
}
