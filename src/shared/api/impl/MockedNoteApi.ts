import { injectable } from 'inversify'
import type { IResult } from 'src/shared/result'
import { Ok } from 'src/shared/result'
import type { CreateNoteRequest, INoteApi, Note, SearchNotesRequest } from 'src/shared/api/interface/INoteApi'

@injectable()
export class MockedNoteApi implements INoteApi {
  private notes: Note[] = []
  private currentUserName = 'Test User'

  async createNote(request: CreateNoteRequest): Promise<IResult<Note>> {
    const note: Note = {
      id: Math.random().toString(36).substring(7),
      title: request.title,
      content: request.content,
      createdAt: new Date(),
      userName: this.currentUserName,
    }

    this.notes.push(note)

    return new Ok(note)
  }

  async searchNotes(request: SearchNotesRequest): Promise<IResult<Note[]>> {
    const query = request.query.toLowerCase()
    const filteredNotes = this.notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
    )

    return new Ok(filteredNotes)
  }
}
