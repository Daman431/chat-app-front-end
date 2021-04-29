import { Component, OnInit } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Chat Bhandar';
  username:any;
  hasUserRegistered:boolean = false;
  socket = socketIo('https://chat-bhandar.herokuapp.com');


  ngOnInit() {
      this.hasUserRegistered = false;
      this.socket.on("disconnection",(data)=>{
        this.printMessage(data);
      })
      this.socket.on('getMessage',(data)=>{    
          console.log("Testing");
          this.printMessage(data);
          
      })
      document.addEventListener("visibilitychange",() => {
        if (!(document.visibilityState === 'visible')) {
          
        }
      });
  }

  setUsername(usernameField){
    let data = {
        username: usernameField.value,
        message:`📢 ${usernameField.value} has joined the chat!`
    }
    if(!usernameField.value){
      usernameField.placeholder = 'Missing!';
      return null;
    }
    this.hasUserRegistered = true;
    this.username = usernameField.value;
    this.socket.emit('login',data);
  }

  sendMessage (userMessage){
    let message = userMessage.value;
    let data = {
        message : message,
        username: this.username
    }
    if(!userMessage.value){
        return null;
    }
    this.socket.emit('emitMessage',data);
    userMessage.value = '';
  }

  printMessage(data){
    let chatContainer = document.querySelector(".chat-container");
    let messageBox = document.createElement('div');
    let usernameContainer = document.createElement('div');
    usernameContainer.appendChild(document.createTextNode(data.username));
    usernameContainer.classList.add("username-container");

    messageBox.classList.add('message-container');
    messageBox.appendChild(usernameContainer)
    messageBox.appendChild(document.createTextNode(data.message))
    chatContainer.appendChild(messageBox);
}


}
