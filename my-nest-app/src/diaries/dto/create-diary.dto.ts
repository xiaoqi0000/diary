export class CreateDiaryDto {
  title: string;
  content: string;
  date?: string;
  mood?: string;
  tags?: string[];
  isPrivate?: boolean;
}
