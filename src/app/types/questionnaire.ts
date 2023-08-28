import { CategoryTreeLite } from "./category";
import { Tag, TagLabel } from "./tag";

export class Question {
  constructor(
    public id: number,
    public name: string = "",
    public children: Question[] = [],
    public category?: CategoryTreeLite,
    public tag_label?: TagLabel,
    public tag?: Tag,
  ) { }
}