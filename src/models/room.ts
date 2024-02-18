import IRoomUser from './room-player';

interface IRoom {
  roomId: string;
  roomUsers: IRoomUser[];
}

export default IRoom;
