import IRoom from "../models/room";

const rooms: IRoom[] = [];

const getRooms = (): IRoom[] => {
 return rooms;
}

export default getRooms;