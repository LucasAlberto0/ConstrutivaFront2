import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@shared/auth.service';
import { UserInfo } from '@shared/models/user.model';
import { environment } from '../../environments/environment';

interface Message {
  text: string;
  timestamp: Date;
  isUser: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [AuthService],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  messages: Message[] = [];
  newMessage: string = '';
  userProfilePicUrl: string | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.messages.push({
      text: 'Olá! Como posso ajudar você hoje?',
      timestamp: new Date(),
      isUser: false
    });

    this.authService.getMe().subscribe({
      next: (userInfo: UserInfo) => {
        if (userInfo.profilePictureUrl) {
          this.userProfilePicUrl = this._getProfilePictureFullUrl(userInfo.profilePictureUrl);
        } else {
          this.userProfilePicUrl = 'public/img/userIcon.svg';
        }
      },
      error: (err: any) => {
        console.error('Failed to fetch user info for profile picture:', err);
        this.userProfilePicUrl = 'public/img/userIcon.svg';
      }
    });
  }

  private _getProfilePictureFullUrl(relativeUrl: string | undefined): string | undefined {
    if (!relativeUrl) {
      return undefined;
    }
    const baseUrl = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
    const cleanRelativeUrl = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;
    return `${baseUrl}${cleanRelativeUrl}`;
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({
        text: this.newMessage,
        timestamp: new Date(),
        isUser: true
      });
      this.newMessage = '';
      this.simulateAssistantResponse();
    }
  }

  simulateAssistantResponse(): void {
    setTimeout(() => {
      this.messages.push({
        text: 'Entendi. Deixe-me verificar isso para você.',
        timestamp: new Date(),
        isUser: false
      });
    }, 1000);
  }

  scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
