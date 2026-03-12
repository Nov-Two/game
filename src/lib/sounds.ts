const mode: string = import.meta.env.MODE
const formatSoundUrl = (fileName: string) =>
  mode === 'development'
    ? `/static/audio/${fileName}`
    : `${import.meta.env.VITE_APP_CDN_URL}${import.meta.env.VITE_APP_PROJECT_NAME}/audio/${fileName}`
const commonSoundUrl = (fileName: string) => `${import.meta.env.VITE_APP_CDN_URL}common/audio/${fileName}`

export default [
  {
    tag: 'bgm',
    loop: true,
    path: {
      mpeg: formatSoundUrl('BGM_OB51_WL51_Lobby.mp3')
    }
  },
  {
    tag: 'bubble',
    path: {
      mpeg: formatSoundUrl('FF_SFX_BooyahReport_Bubble_Click.mp3')
    }
  },
  {
    tag: 'ice',
    path: {
      mpeg: formatSoundUrl('FF_SFX_BooyahReport_Ice_Click.mp3')
    }
  },
  {
    tag: 'snowball',
    path: {
      mpeg: formatSoundUrl('FF_SFX_BooyahReport_Snowball_Click.mp3')
    }
  },
  {
    tag: 'click',
    path: {
      mpeg: commonSoundUrl('FF_SFX_WebEvent_UI_Click.mp3')
    }
  },
  {
    tag: 'close',
    path: {
      mpeg: commonSoundUrl('FF_SFX_WebEvent_UI_Close.mp3')
    }
  },
  {
    tag: 'confirm',
    path: {
      mpeg: commonSoundUrl('FF_SFX_WebEvent_UI_Confirm.mp3')
    }
  },
  {
    tag: 'toast',
    path: {
      mpeg: commonSoundUrl('FF_SFX_WebEvent_UI_Toast.mp3')
    }
  },
  {
    tag: 'popup',
    path: {
      mpeg: commonSoundUrl('FF_SFX_WebEvent_UI_PopUp.mp3')
    }
  },
  {
    tag: 'grand',
    path: {
      mpeg: commonSoundUrl('FF_SFX_WebEvent_UI_BigPopUp.mp3')
    }
  },
  {
    tag: 'screenshoot',
    path: {
      mpeg: commonSoundUrl('FF_SFX_WebEvent_UI_Screenshot_V2.mp3') // TODO: Upload to GCS CDN
    }
  }
]
