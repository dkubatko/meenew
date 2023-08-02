export class Tag {
  constructor(
    public id: number,
    public name: string,
    public parent_id: number,
    public is_leaf: boolean = false
  ) { }

  static fromObject(object: any): Tag {
    const { id, name, parent_id, is_leaf } = object;
    return new Tag(
      id,
      name,
      parent_id,
      is_leaf);
  }
}

export class TagTree {
  constructor(
    public id: number,
    public name: string,
    public parent_id: number,
    public children?: TagTree[],
    public is_leaf: boolean = true
  ) { }

  toTagType(): Tag {
    return new Tag(this.id, this.name, this.parent_id, this.is_leaf);
  }

  static fromObject(object: any): TagTree {
    const { id, name, parent_id, children, is_leaf } = object;
    return new TagTree(
      id,
      name,
      parent_id,
      children ? children.map(TagTree.fromObject) : undefined,
      is_leaf);
  }

  toTagLeafList(): Tag[] {
    // Initialize the queue with the root node.
    const queue: TagTree[] = [this];
    const tags: Tag[] = [];
  
    while(queue.length > 0) {
      // Dequeue a node from the queue.
      const current = queue.shift()!;
  
      // Convert current TagTree node to Tag and push it to tags array if it's a leaf.
      if (current.is_leaf) {
        tags.push(current.toTagType());
      }
  
      // If the current node has children, enqueue them.
      if(current.children) {
        queue.push(...current.children);
      }
    }
  
    return tags;
  }
}

export class TagCreate {
  constructor(
    public name: string,
    public parent_id: number
  ) { }
}