import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {

    function copyRoomCodToClipBoard() {
        navigator.clipboard.writeText(props.code);
    }

    return (
        <button className="room-code" onClick={copyRoomCodToClipBoard}>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <div className="sala">
                <span> Sala #{props.code}</span>
            </div>

        </button>
    )
}