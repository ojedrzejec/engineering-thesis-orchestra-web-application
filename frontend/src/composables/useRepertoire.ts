import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { API_BASE_URL } from '@/constants/config'
import { useAuthStore } from '@/stores/useAuthStore'
import type { TPieceOfMusic } from '@/types/TPieceOfMusic'
import type { TRepertoire } from '@/types/TRepertoire'
import type { TGroup } from '@/types/TGroup'

export const useRepertoire = () => {
  const authStore = useAuthStore()
  const { token } = storeToRefs(authStore)

  const toast = useToast()

  const repertoire = ref<TRepertoire[]>([])
  const piecesOfMusic = ref<TPieceOfMusic[]>([])
  const loadingRepertoire = ref(false)
  const loadingPiecesOfMusic = ref(false)
  const loadingNewPieceOfMusicCreate = ref(false)
  const loadingMusicSheetNotesAdd = ref(false)

  const fetchRepertoire = async (orchestraId: string) => {
    loadingRepertoire.value = true
    try {
      const response = await fetch(
        `${API_BASE_URL}/repertoire/${orchestraId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error('Response not ok.')
      }

      const data = await response.json()
      console.log('Fetched data (available repertoire): ', data)

      repertoire.value = data.map((repertoire: any) => ({
        id: repertoire.id,
        orchestraId: repertoire.id_orchestra,
        title: repertoire.title,
        composer: repertoire.composer,
        pdf: repertoire.pdf_music_sheet_notes,
        groupId: repertoire.id_orchestra_group,
        groupName: repertoire.name,
      }))

      console.log('Fetched available repertoire: ', repertoire.value)
    } catch (e) {
      console.error(e)
      const baseErrorMessage = "Failed to fetch orchestra's repertoire."
      console.error(baseErrorMessage, e)
      repertoire.value = []
    } finally {
      loadingRepertoire.value = false
    }
  }

  const fetchPiecesOfMusic = async (orchestraId: string) => {
    loadingPiecesOfMusic.value = true
    try {
      const response = await fetch(
        `${API_BASE_URL}/repertoire/pieces-of-music/${orchestraId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error('Response not ok.')
      }

      const data = await response.json()
      console.log('Fetched data (piecesOfMusic): ', data)

      piecesOfMusic.value = data

      console.log('Fetched piecesOfMusic: ', piecesOfMusic.value)
    } catch (e) {
      console.error(e)
      const baseErrorMessage = "Failed to fetch orchestra's piecesOfMusic."
      console.error(baseErrorMessage, e)
      piecesOfMusic.value = []
    } finally {
      loadingPiecesOfMusic.value = false
    }
  }

  const createPieceOfMusic = async (
    orchestraId: string,
    title: string,
    composer: string,
  ) => {
    loadingNewPieceOfMusicCreate.value = true

    const formData = {
      id_orchestra: orchestraId,
      title: title,
      composer: composer,
    }
    console.log('formData:', JSON.stringify(formData, null, 2))

    try {
      const response = await fetch(`${API_BASE_URL}/repertoire/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Response not ok.')
      }

      toast.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'New piece of music created!',
        life: 3000,
      })
    } catch (e) {
      console.error(e)
      const baseErrorMessage = 'Failed to post a new piece of music.'
      console.error(baseErrorMessage, e)
      toast.add({
        severity: 'error',
        summary: baseErrorMessage,
        life: 3000,
      })
    } finally {
      loadingNewPieceOfMusicCreate.value = false
    }
  }

  const addMusicSheetNotes = async (
    orchestraId: string,
    pieceOfMusic: TPieceOfMusic,
    selectedGroup: TGroup,
    file: string,
  ) => {
    loadingMusicSheetNotesAdd.value = true

    const formData = {
      orchestraId: orchestraId,
      pieceOfMusicId: pieceOfMusic.id,
      pdf: file,
      groupId: selectedGroup.id,
    }
    console.log('formData:', JSON.stringify(formData, null, 2))

    try {
      const response = await fetch(`${API_BASE_URL}/repertoire/add-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Response not ok.')
      }

      toast.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Music sheet notes added!',
        life: 3000,
      })
    } catch (e) {
      console.error(e)
      const baseErrorMessage = 'Failed to add music sheet notes.'
      console.error(baseErrorMessage, e)
      toast.add({
        severity: 'error',
        summary: baseErrorMessage,
        life: 3000,
      })
    } finally {
      loadingMusicSheetNotesAdd.value = false
    }
  }

  return {
    repertoire,
    piecesOfMusic,
    loadingRepertoire,
    loadingPiecesOfMusic,
    loadingNewPieceOfMusicCreate,
    loadingMusicSheetNotesAdd,
    fetchRepertoire,
    fetchPiecesOfMusic,
    createPieceOfMusic,
    addMusicSheetNotes,
  }
}
