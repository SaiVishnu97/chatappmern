import React from 'react'
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from './miscellenous/miscellenousjsfunc.js'
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json";


const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const ScrollableMessage = ({messages,currentchatid,typinguser}) => {

    const user=JSON.parse(localStorage.getItem('userinfo'));
    const lastmessageref=React.useRef(null);
    React.useEffect(()=>{
     if(lastmessageref.current)
     {
        lastmessageref.current.scrollIntoView()
     }
    },[currentchatid,messages,typinguser])
  return (
    <div style={{overflowY:'scroll'}} >
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id} >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }} ref={(element)=>{if(i===messages.length-1&&!typinguser)lastmessageref.current=element}}>
              {m.content}
            </span>
            
          </div>
        ))}
        {typinguser&&(<div style={{alignSelf:'flex-end'}} ref={lastmessageref}><Lottie options={defaultOptions}
                    height={30}
                    width={50}
                    style={{ marginBottom: 15, marginLeft: 15,borderRadius:10 }}
                  />
                  {typinguser.name} is typing
                  </div>)}
        </div>
  )
}

export default ScrollableMessage