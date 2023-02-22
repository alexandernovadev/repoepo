import { useEffect } from 'react'
import { getGubagooKeyBySite } from '../sites/gacSites'

const useHandleChat = (allowChat: boolean = false, site: string) => {
  const loadChat = () => {
    const chatExist = document.getElementById('gubagooChat')

    if (!chatExist) {
      const script = document.createElement('script')
      script.src = getGubagooKeyBySite(site as string) || ''
      script.id = 'gubagooChat'
      document.body.appendChild(script)
    }
  }
  const hideChat = () => {
    const ggToolbar = document.getElementById('gg-toolbar')

    const ggAnnouncement = document.getElementsByClassName(
      'gg-announcement__top'
    )

    const ggChatBubble = document.getElementsByClassName(
      'gg-chat-bubble gg-app'
    )

    const ggChatApp = document.getElementsByClassName(
      'gg-app'
    )

    const ggInvite = document.getElementsByClassName(
      'gg-invite gg-popup gg-no-close gg-v-bottom gg-reset undefined ns-show gg-effect-appear'
    )

    const ggChat = document.getElementsByClassName(
      'gg-popup gg-chatbox gg-no-close gg-reset gg-mobile-false gg-app-chat gg-app-popup gg-view-welcome ns-show gg-effect-scale'
    )

    const ggChatContainer = document.getElementsByClassName(
      'ChatBubbleContainer__ChatBubbleContainerWrapper-b4evch-0'
    )

    const ggDialog = document.getElementsByClassName('gg-dialog')

    if (ggToolbar) {
      ggToolbar.remove()
    }

    if (ggAnnouncement[0]) {
      ggAnnouncement[0].remove()
    }

    if (ggInvite[0]) {
      ggInvite[0].remove()
    }

    if (ggChat[0]) {
      ggChat[0].remove()
    }

    if (ggDialog[0]) {
      ggDialog[0].remove()
    }

    if (ggChatContainer[0]) {
      ggChatContainer[0].remove()
    }

    if (ggChatBubble[0]) {
      ggChatBubble[0].remove()
    }

    if (ggChatApp[0]) {
      ggChatApp[0].remove()
    }
  }

  const showChat = () => {
    if ((window as any).ggLoader) {
      ;(window as any).ggLoader.init()
    }
  }

  useEffect(() => {
    let interval: any
    if (allowChat) {
      loadChat()
      showChat()
    } else {
      hideChat()
      if (allowChat === false) {
        interval = setInterval(() => {
          const ggInvite = document.getElementsByClassName(
            'gg-invite gg-popup gg-no-close gg-v-bottom gg-reset undefined ns-show gg-effect-appear'
          )

          if (ggInvite[0]) {
            clearInterval(interval)

            ggInvite[0].remove()
          }
        }, 10)
      }
    }
    return () => {
      hideChat()
      clearInterval(interval)
    }
  }, [allowChat])
}

export default useHandleChat
