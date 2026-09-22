export interface SearchEvent {
  id: string
  title: string
  description: string
  category: string
  shortCategory: string
  date: string
  location: string
  capacity: string
  status: string
  image: string
  tags: string[]
  rating?: number
  reviewCount?: number
}
