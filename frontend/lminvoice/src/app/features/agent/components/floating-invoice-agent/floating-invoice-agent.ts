import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { InvoiceAgentService } from '../../services/invoice-agent.service';

interface ChatMessage {
  sender: 'user' | 'agent';
  text: string;
}

@Component({
  selector: 'app-floating-invoice-agent',
  imports: [TranslatePipe],
  templateUrl: './floating-invoice-agent.html',
  styleUrl: './floating-invoice-agent.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloatingInvoiceAgent {
  private invoiceAgentService = inject(InvoiceAgentService);
  private translationService = inject(TranslationService);

  open = signal(false);
  loading = signal(false);
  question = signal('');
  messages = signal<ChatMessage[]>([
    {
      sender: 'agent',
      text: this.translationService.translate('agent.welcome')
    }
  ]);

  toggleOpen(): void {
    this.open.update(value => !value);
  }

  ask(message = this.question()): void {
    const question = message.trim();

    if (!question || this.loading()) {
      return;
    }

    this.question.set('');
    this.messages.update(messages => [...messages, { sender: 'user', text: question }]);
    this.loading.set(true);

    this.invoiceAgentService.ask(question).subscribe({
      next: answer => {
        this.messages.update(messages => [...messages, { sender: 'agent', text: answer }]);
        this.loading.set(false);
      },
      error: () => {
        this.messages.update(messages => [
          ...messages,
          { sender: 'agent', text: this.translationService.translate('agent.error') }
        ]);
        this.loading.set(false);
      }
    });
  }

  updateQuestion(value: string): void {
    this.question.set(value);
  }
}
