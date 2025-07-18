'use-client'

interface DetectionResultProps {
    resultUrl: string
}

const DetectionResult = ({ resultUrl }: DetectionResultProps) => {
    const isVideo = resultUrl.includes('.mp4')

    return (
        <div className="flex justify-center mb-6">
            {isVideo ? (
                <video
                    src={resultUrl}
                    controls
                    className="w-auto max-h-64 border rounded shadow"
                />
            ) : (
                <img
                    src={resultUrl}
                    alt="Kết quả"
                    className="w-auto max-h-64 border rounded shadow"
                />
            )}
        </div>
    )
}

export default DetectionResult