import { FC, createContext, useContext, ReactNode } from 'react'
import useLocalStorage from '../hooks/useStorage'
import { ELang } from '../interfaces'

type Translations = {
  [key: string]: {
    [key: string]: string
  }
}

const translations: Translations = {
  en: {
    homePage: 'Home page',
    home: 'Home',
    about: 'About',
    videos: 'Videos',
    store: 'Store',
    contact: 'Contact',
    rightsReserved: 'All rights reserved',
    siteBy: 'Site by',
    clickMeShadow: 'Click me to toggle shadow effect',
    videoTitled: 'Video titled',
    linkToVideo: 'Link to video page',
    toggleTheme: 'Toggle theme',
    toggleLanguage: 'Vaihda kieltä',
    kuokkalaChurch: 'Kuokkala Church',
    order: 'Order',
    composition: 'A composition',
    arrangement: 'An arrangement',
    compositions: 'Compositions',
    arrangements: 'Arrangements',
    composerAndArranger: 'Composer and Arranger',
    lyr: 'Lyr.',
    arr: 'Arr.',
    comp: 'Comp.',
    solist: 'Solist',
    choirs: 'Choirs',
    and: 'and',
    introText1: `I am a professional choir and orchestra conductor in the Southern Finland area. Closest to my heart is choir and orchestra music, but entertainment, pop, rock and jazz music have always been an essential part of my work.`,
    introText2: `At the moment I conduct three choirs. In addition to the artistic director's work, I compose and arrange music for all types of choirs, orchestras and bands.`,
    services: 'Services',
    howToOrder: 'How to order',
    howToOrderProduct: 'How to order a product?',
    contactThroughForm: 'You can contact me through the contact form',
    contactMe: 'Contact me',
    suitableArrangements:
      'Get an arrangement suitable for your band, orchestra or vocal ensemble.',
    addContactInfo: 'Add your contact information',
    whichPiece: 'Which piece it is',
    pieceName: 'Name of the piece',
    sendMaterials: 'Send what materials you have available',
    whatEnsemble: 'For what kind of ensemble the piece should be arranged',
    ensemble: 'Ensemble',
    scheduleRequest: 'Schedule request',
    scheduleRequestLong:
      'Schedule request, when should the arrangement be available for you',
    sendSheetMusicInstructions:
      'Send sheet music: The sheet music you are sending must include melody, lyrics and at least some chord symbols; also the desired key.',
    youWillReceiveAnOffer:
      'You will receive an offer in return; delivery content, price information and an estimate of the schedule.',
    eachOrderIndividual:
      'Each order is individual in price and delivery time, depending on the scope and complexity of the order.',
    files: 'Files',
    noFiles: 'No files',
    allowedFileTypes: 'Allowed file types are .pdf, .jpg, .jpeg and .png',
    maxFiles10: 'Maximum of 10 files allowed',
    maxFileSizeIs: 'Maximum file size is',
    fileSizeExceeded: 'File size exceeded',
    confirmRemoveFile: 'Are you sure you want to remove this file?',
    skipToMainNavigation: 'Skip to main navigation',
    skipToMainContent: 'Skip to main content',
    skipToFooter: 'Skip to footer',
    backToTop: 'Back to top',
    back: 'Back',
    wishes: 'Your wishes',
    yourMessage: 'Your message',
    compositionInstructions: 'Tell me your wishes for the composition',
    compositionIntro:
      'You can order a composition by sending me a poem or even a topic (drinking song, serenade etc.)',
    partRecordings: 'Part Recordings',
    partsIntro:
      'An excellent self-study opportunity for a choir member. The recording is easy to listen to even on the way to work and practice singing at the same time.',
    partsInstructions0:
      'You can order a part recording for your choir, where the desired piece/pieces are:',
    partsInstructions1: 'The part played and sung alone.',
    partsInstructions2:
      'The part reinforced so that other parts are heard in the background.',
    partsInstructions3:
      'The piece so that "your part" is inaudible and the other parts are heard.',
    notation: 'Notation',
    haveAHandwrittenScore:
      'Do you have a difficult-to-read, handwritten score? Or a score simply too small to read? Send it to me and you will receive neatly written scores made with notation software.',
    sendByMailOrAttachment:
      'Send the score either as an image attachment or ask for a mailing address to send the original.',
    receiveBack:
      'You will receive the finished product back within a week or two, either as a printout or in PDF format, according to your wishes.',

    greatWesternTitle1: 'Great Western - Letter Scene',
    greatWesternText1:
      'This text video is a demonstration on how important music is in movies. I composed the music for a scene in a movie that does not yet exist. The movie is called Great Western and this is the theme music for one scene.',
    greatWesternTitle2: 'Overture of the Great Western',
    greatWesternTitle3: 'Great Western - Sheriff',
    greatWesternText3:
      'Our Great Western series has now reached its third part. Now we get to follow the eventful life of the town sheriff for a day.',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    subject: 'Topic',
    changeSubjectHere: 'Change topic here',
    message: 'Message',
    messages: 'Messages',
    submit: 'Submit',
    billingAddress: 'Billing address',
    city: 'City',
    zip: 'Zip code',
    country: 'Country',
    clear: 'Clear',
    remove: 'Remove',
    requiredField: 'Required field',
    selectOption: 'Please select an option',
    other: 'Other',
    messageSentSuccessfully: 'Message sent successfully',
    errorSendingMessage: 'Error sending message',
    login: 'Log in',
    errorLoggingIn: 'Error logging in',
    error: 'Error',
    logout: 'Log out',
    logoutConfirmation: 'Are you sure you want to log out?',
    register: 'Register',
    password: 'Password',
    changePassword: 'Change password',
    newPasswordAgain: 'New password again',
    oldPassword: 'Old password',
    newPassword: 'New password',
    passwordsDoNotMatch: 'Passwords do not match',
    passwordChangedSuccessfully: 'Password changed successfully',
    errorChangingPassword: 'Error changing password',
    errorChangingMessage: 'Error changing message',
    errorRemovingMessage: 'Error removing message',
    messageEdited: 'Message edited',
    messageRemoved: 'Message removed',
    removeMessage: 'Remove message',
    confirmRemoveMessage: 'Are you sure you want to remove this message?',
    role: 'Role',
    contactInfo: 'Contact info',
    userInfo: 'User info',
    username: 'Username',
    newUsername: 'New username',
    changeUsername: 'Change username',
    usernameChangedSuccessfully: 'Username changed successfully',
    errorChangingUsername: 'Error changing username',
    changeInfo: 'Change info',
    received: 'Received',
    updated: 'Updated',
    attachments: 'Attachments',
    noAttachments: 'No attachments',
    emptyFields: 'Empty form',
    emptyFieldsConfirmation: 'Are you sure you want to empty all fields?',
  },
  fi: {
    homePage: 'Etusivu',
    home: 'Alku',
    about: 'Tietoa',
    videos: 'Videoita',
    store: 'Kauppa',
    contact: 'Ota yhteyttä',
    rightsReserved: 'Kaikki oikeudet pidätetään',
    siteBy: 'Sivuston toteuttanut',
    clickMeShadow: 'Varjoefekti päälle/pois klikkaamalla',
    videoTitled: 'Videon otsikko',
    linkToVideo: 'Linkki videon sivulle',
    toggleTheme: 'Vaihda teemaa',
    toggleLanguage: 'Change language',
    kuokkalaChurch: 'Kuokkalan kirkko',
    order: 'Tilaa',
    composition: 'Sävellys',
    arrangement: 'Sovitus',
    compositions: 'Sävellykset',
    arrangements: 'Sovitukset',
    composerAndArranger: 'Säveltäjä ja sovittaja',
    lyr: 'San.',
    arr: 'Sov.',
    comp: 'Säv.',
    solist: 'Solisti',
    choirs: 'Kuorot',
    and: 'ja',
    introText1:
      'Olen ammattimainen kuoron- ja orkesterinjohtaja Etelä-Suomen alueella. Sydäntäni lähinnä on kuoro- ja orkesterimusiikki, mutta viihde-, pop-, rock- ja jazzmusiikki ovat aina olleet tärkeä osa työtäni.',
    introText2:
      'Tällä hetkellä johdan kolmea kuoroa. Taiteellisen johtajan työn ohessa teen tilauksesta sävellyksiä ja sovituksia kaikille kuoromuodoille, orkestereille ja yhtyeille.',
    services: 'Palvelut',
    howToOrder: 'Kuinka toimia',
    howToOrderProduct: 'Kuinka tilaan tuotteen?',
    contactThroughForm: 'Voit ottaa yhteyttä minuun yhteydenottolomakkeen kautta',
    contactMe: 'Ota yhteyttä',
    suitableArrangements:
      'Hanki juuri sinun bändisi, orkesterisi tai lauluyhtyeesi kokoonpanolle sopiva sovitus.',
    addContactInfo: 'Lisää yhteystietosi',
    whichPiece: 'Mikä kappale on kyseessä',
    pieceName: 'Kappaleen nimi',
    sendMaterials: 'Lähetä mitä materiaalia sinulla on käytettävissä',
    whatEnsemble: 'Minkälaiselle kokoonpanolle teos on sovitettava',
    ensemble: 'Kokoonpano',
    scheduleRequest: 'Aikataulutoive',
    scheduleRequestLong:
      'Aikataulutoive eli milloin sovitus pitäisi olla käytettävissänne',
    sendSheetMusicInstructions:
      'Lähetä nuotti: Lähettämässäsi nuotissa pitää olla mukana sävel, sanat ja vähintään auttavat sointumerkit; lisäksi toivottu sävellaji.',
    youWillReceiveAnOffer:
      'Saat paluupostissa tarjouksen; toimitussisällön, hintatiedot ja aikatauluarvion.',
    eachOrderIndividual:
      'Jokainen tilaus on hinnaltaan ja toimitusajaltaan yksilöllinen, riippuen tilauksen laajuudesta ja vaativuudesta.',
    files: 'Tiedostot',
    noFiles: 'Ei tiedostoja',
    allowedFileTypes: 'Sallitut tiedostotyypit ovat .pdf, .jpg, .jpeg ja .png',
    maxFiles10: 'Korkeintaan 10 tiedostoa sallittu',
    maxFileSizeIs: 'Suurin sallittu tiedostokoko on',
    fileSizeExceeded: 'Tiedoston koko ylitti sallitun',
    confirmRemoveFile: 'Haluatko varmasti poistaa tämän tiedoston?',
    skipToMainNavigation: 'Siirry päävalikkoon',
    skipToMainContent: 'Siirry pääsisältöön',
    skipToFooter: 'Siirry sivun alalaitaan',
    backToTop: 'Takaisin ylös',
    back: 'Takaisin',
    wishes: 'Toiveesi',
    yourMessage: 'Viestisi',
    compositionInstructions: 'Kerro toiveesi sävellyksen suhteen',
    compositionIntro:
      'Voit tilata minulta sävellyksen lähettämällä minulle runon tai vaikkapa aiheen (juomalaulu, serenadi jne.)',
    partRecordings: 'Stemmalevyt',
    partsIntro:
      'Erinomainen itseopiskelumahdollisuus kuorolaiselle. Äänitettä on helppo kuunnella vaikka ajomatkalla töihin ja harjoitella laulua siinä samalla.',
    partsInstructions0:
      'Voit tilata kuorollesi stemmalevyn, jossa haluamistasi kappaleesta/kappaleista on:',
    partsInstructions1: 'Stemma soitettuna ja laulettuna yksinään.',
    partsInstructions2: 'Stemma vahvistettuna niin että muut stemmat kuuluvat taustalla.',
    partsInstructions3:
      'Kappale niin että ”oma stemma" on kuulumattomissa ja muut kuuluvat.',
    notation: 'Nuotinnus',
    haveAHandwrittenScore:
      'Onko sinulla hankalasti luettava, käsinkirjoitettu nuotti? Vai onko nuottisi vain liian pientä luettavaksi? Lähetä se minulle, niin saat itsellesi nuotinnusohjelmalla puhtaaksikirjoitetut, selkeät nuotit.',
    sendByMailOrAttachment:
      'Lähetä joko kuvatiedosto liitteenä tai pyydä osoite alkuperäisen nuotin postittamista varten.',
    receiveBack:
      'Saat valmiin tuotteen takaisin viikossa tai kahdessa, toiveidesi mukaan joko tulosteena tai PDF-tiedostona.',
    greatWesternTitle1: 'Great Western - Kirjekohtaus',
    greatWesternText1:
      'Tämä tekstivideo on demonstrointi siitä, kuinka tärkeää musiikki on elokuvissa. Sävelsin musiikin kohtaukseen elokuvassa, jota ei vielä ole olemassa. Elokuvan nimi on Great Western ja tämä on teemamusiikki yhteen kohtaukseen.',
    greatWesternTitle2: 'Great Western avausraita (Overture)',
    greatWesternTitle3: 'Great Western - Sheriffi',
    greatWesternText3:
      'Great Western -sarjamme on nyt edennyt kolmanteen osaan. Nyt saamme seurata paikkakunnan seriffin tapahtumarikasta elämää vuorokauden ajan.',
    firstName: 'Etunimi',
    lastName: 'Sukunimi',
    email: 'Sähköposti',
    subject: 'Aihe',
    changeSubjectHere: 'Vaihda aihetta tästä',
    message: 'Viesti',
    messages: 'Viestit',
    submit: 'Lähetä',
    billingAddress: 'Laskutusosoite',
    city: 'Kaupunki',
    zip: 'Postinumero',
    country: 'Maa',
    clear: 'Tyhjennä',
    remove: 'Poista',
    requiredField: 'Pakollinen kenttä',
    selectOption: 'Valitse vaihtoehto',
    other: 'Muu',
    messageSentSuccessfully: 'Viesti lähetetty onnistuneesti',
    errorSendingMessage: 'Virhe viestiä lähetettäessä',
    login: 'Kirjaudu sisään',
    errorLoggingIn: 'Virhe kirjautumisessa',
    errorChangingMessage: 'Virhe viestiä muutettaessa',
    errorRemovingMessage: 'Virhe viestiä poistettaessa',
    messageEdited: 'Viestiä muutettu',
    messageRemoved: 'Viesti poistettu',
    removeMessage: 'Poista viesti',
    confirmRemoveMessage: 'Haluatko varmasti poistaa tämän viestin?',
    error: 'Virhe',
    logout: 'Kirjaudu ulos',
    logoutConfirmation: 'Haluatko varmasti kirjautua ulos?',
    register: 'Rekisteröidy',
    password: 'Salasana',
    changePassword: 'Vaihda salasana',
    newPasswordAgain: 'Uusi salasana uudelleen',
    oldPassword: 'Vanha salasana',
    newPassword: 'Uusi salasana',
    passwordsDoNotMatch: 'Salasanat eivät täsmää',
    passwordChangedSuccessfully: 'Salasana vaihdettu onnistuneesti',
    errorChangingPassword: 'Virhe salasanaa vaihdettaessa',
    role: 'Rooli',
    contactInfo: 'Yhteystiedot',
    userInfo: 'Käyttäjätiedot',
    username: 'Käyttäjänimi',
    newUsername: 'Uusi käyttäjänimi',
    changeUsername: 'Vaihda käyttäjänimi',
    usernameChangedSuccessfully: 'Käyttäjänimi vaihdettu onnistuneesti',
    errorChangingUsername: 'Virhe käyttäjänimeä vaihdettaessa',
    changeInfo: 'Muuta tietoja',
    received: 'Vastaanotettu',
    updated: 'Päivitetty',
    attachments: 'Liitteet',
    noAttachments: 'Ei liitteitä',
    emptyFields: 'Tyhjennä lomake',
    emptyFieldsConfirmation: 'Haluatko varmasti tyhjentää kaikki kentät?',
  },
}

type TranslationContextType = {
  language: ELang
  setLanguage: (language: ELang) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export const TranslationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<ELang>('OlliSantaLanguage', ELang.fi)

  const t = (key: string) => {
    return translations[language][key] || key
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}
