import type { IResult } from 'shared__result'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  userName: string
}

export interface CreateNoteRequest {
  title: string
  content: string
}

export interface SearchNotesRequest {
  query: string
}

export interface INoteApi {
  createNote(request: CreateNoteRequest): Promise<IResult<Note>>
  searchNotes(request: SearchNotesRequest): Promise<IResult<Note[]>>
}
