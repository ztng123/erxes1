import { Model, model } from 'mongoose';
import {
  destroyBoardItemRelations,
  fillSearchTextItem,
  createBoardItem,
  watchItem
} from './utils';
import { ACTIVITY_CONTENT_TYPES } from './definitions/constants';
import { ITicket, ITicketDocument, ticketSchema } from './definitions/tickets';

export interface ITicketModel extends Model<ITicketDocument> {
  createTicket(doc: ITicket): Promise<ITicketDocument>;
  getTicket(_id: string): Promise<ITicketDocument>;
  updateTicket(_id: string, doc: ITicket): Promise<ITicketDocument>;
  watchTicket(_id: string, isAdd: boolean, userId: string): void;
  removeTickets(_ids: string[]): Promise<{ n: number; ok: number }>;
}

export const loadTicketClass = () => {
  class Ticket {
    /**
     * Retreives Ticket
     */
    public static async getTicket(_id: string) {
      const ticket = await Tickets.findOne({ _id });

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      return ticket;
    }

    /**
     * Create a Ticket
     */
    public static async createTicket(doc: ITicket) {
      if (doc.sourceConversationIds) {
        const convertedTicket = await Tickets.findOne({
          sourceConversationIds: { $in: doc.sourceConversationIds }
        });

        if (convertedTicket) {
          throw new Error('Already converted a ticket');
        }
      }

      return createBoardItem(doc, 'ticket');
    }

    /**
     * Update Ticket
     */
    public static async updateTicket(_id: string, doc: ITicket) {
      const searchText = fillSearchTextItem(doc, await Tickets.getTicket(_id));

      await Tickets.updateOne({ _id }, { $set: doc, searchText });

      return Tickets.findOne({ _id });
    }

    /**
     * Watch ticket
     */
    public static async watchTicket(
      _id: string,
      isAdd: boolean,
      userId: string
    ) {
      return watchItem(Tickets, _id, isAdd, userId);
    }

    public static async removeTickets(_ids: string[]) {
      // completely remove all related things
      for (const _id of _ids) {
        await destroyBoardItemRelations(_id, ACTIVITY_CONTENT_TYPES.TICKET);
      }

      return Tickets.deleteMany({ _id: { $in: _ids } });
    }
  }

  ticketSchema.loadClass(Ticket);

  return ticketSchema;
};

loadTicketClass();

// tslint:disable-next-line
const Tickets = model<ITicketDocument, ITicketModel>('tickets', ticketSchema);

export default Tickets;
