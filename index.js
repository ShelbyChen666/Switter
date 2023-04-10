import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', e => {
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id === 'reply-btn'){
        handleReplyBtnClick(e.target.dataset.replyid)
        console.log(e.target.dataset.replyid)
    }
})

 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(tweet => {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    if (document.getElementById(`replies-${tweetId}`).classList.contains('hidden')){
        render()
    } else {
        render()
        handleReplyClick(tweetId)
    }
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(tweet =>{
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    if (document.getElementById(`replies-${tweetId}`).classList.contains('hidden')){
        render()
    } else {
        render()
        handleReplyClick(tweetId)
    }
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Puppy`,
            profilePic: `images/user-puppy.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleReplyBtnClick(replyId){
    const replyInput = document.getElementById(`reply-input-${replyId}`)
    if(replyInput.value){
        for (const tweet of tweetsData){
            if(tweet.uuid === replyId){
                tweet.replies.unshift({
                handle: `@Puppy`,
                profilePic: `images/user-puppy.png`,
                tweetText: replyInput.value,
                })
            }

        }
        render()
        replyInput.value = ''
        handleReplyClick(replyId)
    }
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(tweet => {
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = `                    
            <div class="tweet-reply">
                <div class="tweet-inner">
                    <img src="images/user-puppy.png" class="profile-pic">
                        <div>
                            <p class="handle">@Puppy</p>
                            <textarea placeholder="Tweet your reply" id="reply-input-${tweet.uuid}" class="tweet-text reply-input"></textarea>
                            <button id="reply-btn" data-replyid=${tweet.uuid}>Reply</button>
                        </div>
                </div>
            </div>`
            

        if(tweet.replies.length > 0){
            tweet.replies.forEach(reply =>{
                repliesHtml +=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
        }
        
        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>   
            </div>
            `
    })
    return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

