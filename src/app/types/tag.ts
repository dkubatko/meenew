export class Tag {
  constructor(
    public id: number = 0,
    public name: string = "",
    public label_id: number | null = null
  ) { }

  static fromObject(object: any): Tag {
    const { id, name, label_id } = object;
    return new Tag(id, name, label_id);
  }

  static new(label_id: number): Tag {
    return new Tag(undefined, undefined, label_id);
  }
}

export class TagCreate {
  constructor(
    public name: string,
    public label_id: number | null = null,
  ) { }
}

export class TagLabel {
  constructor(
    public id: number | null = null,
    public name: string = "",
    public category_id?: number,
    public tags: Tag[] = [],
  ) { }

  static fromObject(object: any): TagLabel {
    const { id, name, category_id, tags } = object;
    return new TagLabel(
      id,
      name,
      category_id,
      tags ? tags.map(Tag.fromObject) : []
    );
  }

  static new(category_id: number): TagLabel {
    return new TagLabel(undefined, undefined, category_id);
  }
}


