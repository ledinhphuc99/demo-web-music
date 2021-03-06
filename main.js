const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'PHUC_PLAYER'

const heading = $('.body-music__name h2')
const background = $('.video')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const control = $('.control')
const mutedBtn = $('.btn-toggle-volume')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev') 
const radomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.body-list')

 
const app ={
    currentIndex: 0,
    isPlaying: false,
    isMuted: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs:[
        {
            name: 'Enemy',
            singer: 'Imagine Dragons x J.I.D',
            path: './styles/music/Arcane.mp3',
            background: './styles/video/Arcane.mp4',
        },
        {
            name: 'LetHerGo',
            singer: 'Imagine Dragons x J.I.D',
            path: './styles/music/LetHerGo.mp3',
            background: './styles/video/LetHerGo.mp4',
        },
        {
            name: 'Once Upon A Time',
            singer: 'Max Oazo ft. MoonessD',
            path: './styles/music/OnceUponATime.mp3',
            background: './styles/video/OnceUponATime.mp4',
        },
        {
            name: 'Bad Guy ',
            singer: '- Billie Eilish',
            path: './styles/music/BadGuy.mp3',
            background: './styles/video/BadGuy.mp4',
        },
        {
            name: 'At My Worst ',
            singer: 'Pink Sweat',
            path: './styles/music/AtMyWorst.mp3',
            background: './styles/video/AtMyWorst.mp4',
        },
        {
            name: 'Memories  ',
            singer: ' Maroon 5',
            path: './styles/music/Memories.mp3',
            background: './styles/video/Memories.mp4',
        },
        {
            name: 'What Are Words ',
            singer: ' Chris Medina  ',
            path: './styles/music/WhatAreWords.mp3',
            background: './styles/video/WhatAreWords.mp4',
        },
        {
            name: 'I Love You 3000   ',
            singer: ' Stephanie Poetri 5',
            path: './styles/music/ILoveYou3000.mp3',
            background: './styles/video/ILoveYou3000.mp4',
        },
        {
            name: 'So Far Away  ',
            singer: ' Adam Christophe',
            path: './styles/music/SoFarAway.mp3',
            background: './styles/video/SoFarAway.mp4',
        },
        {
            name: 'B?????c Qua Nhau  ',
            singer: ' V?? ',
            path: './styles/music/BuocQuaNhau.mp3',
            background: './styles/video/BuocQuaNhau.mp4',
        },
    ],
    setConfig: function (key, value) {
        this.config[key] =value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))

    },

    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' :''}" data-index="${index}">
              <i class="fas fa-music body-icon"></i>
             <h3 class="title">${song.name}</h3>
             <p class="author">${song.singer}</p>
             </div>
            `
        })
        playList.innerHTML = htmls.join('')

    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        //x??? l?? khi click play 
        playBtn.onclick= function(){
            if(_this.isPlaying){
             audio.pause()
             background.pause()
            } else{
                 audio.play() 
                 background.play()
            }

        }
        //khi song ???????c play 
        audio.onplay = function(){
            _this.isPlaying = true
            control.classList.add('playing')
           

        }
        //khi song b??? pause 
        audio.onpause = function(){
            _this.isPlaying = false
            control.classList.remove('playing')
            

        }
        //x??? l?? khi click volume
        mutedBtn.onclick = function(){
            if(_this.isMuted){
                _this.isMuted = false
                audio.muted = false
                control.classList.remove('muted')
            } else{  
                _this.isMuted=true
                audio.muted = true
                control.classList.add('muted')
                
            }
        }
        //khi ti???n ????? b??i h??t thay ?????i
        audio.ontimeupdate = function () {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                progress.value = progressPercent
            }

        }
        //x??? l?? khi tua song 
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime

        }
        //khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            } else {
                _this.nextSong()
                
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
         //khi prev song
         prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            } else {
                _this.prevSong()
                
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
            
        }
        //x??? l?? random
        radomBtn.onclick = function(e){
            
                _this.isRandom = !_this.isRandom
                _this. setConfig('isRandom', _this.isRandom)
                radomBtn.classList.toggle('active', _this.isRandom)
               
       
        }
        // x??? l?? ph??t l???i b??i h??t
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this. setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)


        }
        // x??? l?? khi next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            } else {

                nextBtn.click()
            }
        }

        //l???ng nghe click h??nh vi vao play list
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode){
                _this.currentIndex =Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()

            }

        }


    },
    scrollToActiveSong: function () {
        setTimeout(function(){
            $('.song.active').srcollIntOiew({
                behavior: 'smooth',
                block:'nearest',
            })
        }, 100)
    },

    loadCurrentSong: function () {
        

        heading.textContent = this.currentSong.name
        background.src = this.currentSong.background
        audio.src = this.currentSong.path
      

        console.log(heading,background,audio)

    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex <0){
            this.currentIndex =this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function () {
        //g??n c???u h??nh t??? config v??o ??ng d???ng
        this. loadConfig()
        //?????nh ngh??a c??c thu???c t??nh cho object
        this.defineProperties()

        //l???ng nghe/x??? l?? c??c s??? ki???n (DOM event)
        this.handleEvents()

        //T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
       this.loadCurrentSong()

       //render playlist
        this.render()

       // hi???n th??? tr???ng th??i ban ?????u
        radomBtn.classList.toggle('active', _this.isRandom)
        repeatBtn.classList.toggle('active', _this.isRepeat)

    }
}
app.start()