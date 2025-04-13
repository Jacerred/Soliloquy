import Upload from "../components/Upload";

function Main() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}
        className="flex w-full"
        >
            <Upload />
        </div>
    );
}

export default Main;