import { TagLabel as TagLabelType } from "../types/tag";

export default class TagLabelAPIClient {
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

  public async create(tagLabel: TagLabelType): Promise<TagLabelType> {
    const data = await this.fetcher('tag_label', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tagLabel),
    });
    return TagLabelType.fromObject(data);
  }

  public async update(tag: TagLabelType): Promise<TagLabelType> {
    const data = await this.fetcher('tag_label', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tag),
    });
    return TagLabelType.fromObject(data);
  }

  public async delete(id: number): Promise<{ok: boolean}> {
    return this.fetcher(`tag_label/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  }
}