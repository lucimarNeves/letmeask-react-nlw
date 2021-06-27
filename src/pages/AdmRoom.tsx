import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { useParams } from 'react-router';
import { Button } from '../componentes/Button';
import { RoomCode } from '../componentes/RoomCode';

import '../styles/room.scss';
//import { useAuth } from '../hooks/useAuth';
//import { toast } from 'react-hot-toast';
import { Question } from '../componentes/Question';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import { useHistory } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    //const { user } = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId)

    console.log(questions)

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

    async function handleDeleQuestion(questionId: string) {
        if (window.confirm("Você tem certeza que deseja excluir esta pergunta? ")) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({

            isAnswered: true,
        })
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        })
    }

    return (
        <div id="page-room">

            <header>

                <div className="content">

                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}> Encerrar sala</Button>
                    </div>

                </div>

            </header>

            <main>

                <div className="room-title">

                    <h1> Sala {title} </h1>

                    <div className="perguntas">
                        {questions.length > 0 && <span>{questions.length} perguntas </span>}
                    </div>
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <Tooltip title="Respondida" arrow>
                                            <button
                                                type="button"
                                                onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                            >
                                                <img src={checkImg} alt="Marcar pergunta como respondida" />

                                            </button>
                                        </Tooltip>

                                        <Tooltip title="Destacar" arrow>

                                            <button
                                                type="button"
                                                onClick={() => handleHighlightQuestion(question.id)}
                                            >
                                                <img src={answerImg} alt="Dar destaque à pergunta" />

                                            </button>
                                        </Tooltip>
                                    </>
                                )}

                                <Tooltip title="Excluir" arrow>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleQuestion(question.id)}
                                    >
                                        <img src={deleteImg} alt="Remover pergunta" />

                                    </button>
                                </Tooltip>
                            </Question>


                        );
                    })}
                </div>
            </main>

        </div >
    )
}