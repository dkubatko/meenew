import { Tag } from "@/app/types/tag";

export class Question {
  constructor(
    public tag: Tag,
    public question_text: string = "",
    public children: Question[] = [],
  ) { }

  static fromObject(object: any): Question {
    const { tag, question_text, children } = object;
    return new Question(
      Tag.fromObject(tag),
      question_text,
      children ? children.map(Question.fromObject) : []
    );
  }
}