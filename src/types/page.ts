/** Jackson's serialisation of Spring's PageImpl (Spring Boot 3.3). */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  /** Zero-based page index. */
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
