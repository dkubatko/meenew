export class Question {
  constructor(
    public id: number,
    public name: string = "",
    public children: Question[] = [],
  ) { }

  static fromObject(object: any): Question {
    const { id, question_text, children } = object;
    return new Question(
      id,
      question_text,
      children ? children.map(Question.fromObject) : []
    );
  }
}