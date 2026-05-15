import { useRef, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "@/utils/requests";
import "./styles.css";

type RecordingStatus = "idle" | "connecting" | "recording" | "error";

type RealtimeClientSecretResponse = {
  value: string;
  expires_at: number;
  session?: {
    id?: string;
    type?: string;
  };
};

const statusLabel: Record<RecordingStatus, string> = {
  idle: "Parado",
  connecting: "Conectando...",
  recording: "Gravando",
  error: "Erro",
};

const RealtimeTranscription = () => {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [finalTranscript, setFinalTranscript] = useState<string>("");
  const [partialTranscript, setPartialTranscript] = useState<string>("");
  const [error, setError] = useState<string>("");

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const isRecording = status === "recording" || status === "connecting";

  const handleRealtimeEvent = (event: any) => {
    console.log("Realtime event:", event);

    if (event.type === "conversation.item.input_audio_transcription.delta") {
      setPartialTranscript((previous) => previous + event.delta);
      return;
    }

    if (event.type === "conversation.item.input_audio_transcription.completed") {
      const transcript = event.transcript || "";

      if (transcript.trim()) {
        setFinalTranscript((previous) => {
          if (!previous.trim()) {
            return transcript;
          }

          return `${previous}\n${transcript}`;
        });
      }

      setPartialTranscript("");
      return;
    }

    if (event.type === "error") {
      const message = event.error?.message || event.error?.code || "Erro desconhecido recebido da OpenAI Realtime API.";

      setError(message);
      setStatus("error");
    }
  };

  const createRealtimeClientSecret = async (): Promise<string> => {
    const requestParams: AxiosRequestConfig = {
      url: "/transcriptions/realtime/session",
      method: "POST",
      withCredentials: false,
    };

    const response = await requestBackend(requestParams);
    const data = response.data as RealtimeClientSecretResponse;

    if (!data.value) {
      throw new Error("O backend não retornou o client_secret da OpenAI.");
    }

    return data.value;
  };

  const startRecording = async () => {
    try {
      setError("");
      setPartialTranscript("");
      setStatus("connecting");

      const ephemeralKey = await createRealtimeClientSecret();

      const peerConnection = new RTCPeerConnection();
      peerConnectionRef.current = peerConnection;

      const dataChannel = peerConnection.createDataChannel("oai-events");
      dataChannelRef.current = dataChannel;

      dataChannel.addEventListener("open", () => {
        setStatus("recording");
      });

      dataChannel.addEventListener("message", (message) => {
        const event = JSON.parse(message.data);
        handleRealtimeEvent(event);
      });

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      mediaStreamRef.current = mediaStream;

      mediaStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, mediaStream);
      });

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          "Content-Type": "application/sdp",
        },
      });

      if (!sdpResponse.ok) {
        const responseText = await sdpResponse.text();
        throw new Error(`Erro ao conectar na OpenAI Realtime API: ${responseText}`);
      }

      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: await sdpResponse.text(),
      };

      await peerConnection.setRemoteDescription(answer);
    } catch (err) {
      console.error(err);

      const message = err instanceof Error ? err.message : "Erro inesperado ao iniciar a transcrição em tempo real.";

      setError(message);
      setStatus("error");
      stopRecording();
    }
  };

  const stopRecording = () => {
    dataChannelRef.current?.close();
    dataChannelRef.current = null;

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;

    setStatus("idle");
    setPartialTranscript("");
  };

  const clearTranscription = () => {
    setFinalTranscript("");
    setPartialTranscript("");
    setError("");
  };

  return (
    <div className="component realtime-card">
      <div className="component-header">
        <span className="eyebrow">OpenAI Realtime</span>
        <h2>Transcrição em tempo real</h2>
        <p>Clique em iniciar, permita o uso do microfone e fale normalmente. O texto aparece conforme a fala é processada.</p>
      </div>

      <div className="realtime-status-row">
        <div className={`status-pill status-${status}`}>
          <span className="status-dot" />
          {statusLabel[status]}
        </div>
      </div>

      {error && <div className="feedback feedback-error">{error}</div>}

      <div className="realtime-actions">
        {!isRecording ? (
          <button className="primary-button" onClick={startRecording}>
            <i className="bi bi-mic-fill" />
            Iniciar transcrição
          </button>
        ) : (
          <button className="danger-button" onClick={stopRecording}>
            <i className="bi bi-stop-fill" />
            Parar
          </button>
        )}

        <button className="secondary-button" onClick={clearTranscription} disabled={!finalTranscript && !partialTranscript}>
          Limpar
        </button>
      </div>

      <div className="transcription-box">
        <div className="transcription-box-header">
          <h3>Resultado</h3>
          {partialTranscript && <span>recebendo áudio...</span>}
        </div>

        {!finalTranscript && !partialTranscript ? (
          <p className="empty-state">A transcrição aparecerá aqui.</p>
        ) : (
          <p>
            {finalTranscript}
            {partialTranscript && (
              <span className="partial-transcript">
                {finalTranscript ? "\n" : ""}
                {partialTranscript}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default RealtimeTranscription;
