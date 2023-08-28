import { Tag as TagType, TagCreate, TagLabel as TagLabelType } from "@/app/types/tag";

export default class TagAPIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  protected async fetcher(endpoint: string, options?: RequestInit) {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, options);
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async createLabel(tagLabel: TagLabelType): Promise<TagLabelType> {
    const data = await this.fetcher('tag_label', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tagLabel),
    });
    return TagLabelType.fromObject(data);
  }

  public async create(tag: TagType): Promise<TagType> {
    const data = await this.fetcher('tag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tag),
    });
    return TagType.fromObject(data);
  }

  public async update(tag: TagCreate): Promise<TagType> {
    const data = await this.fetcher('tag', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tag),
    });
    return TagType.fromObject(data);
  }

  public async delete(id: number): Promise<{ok: boolean}> {
    return this.fetcher(`tag/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
