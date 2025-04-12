import "../index.css";

function Upload() {
    var filePath = null;
    function VideoPicker() {
        const handleSelect = async () => {
          filePath = await window.electronAPI.selectVideo();
          if (filePath) {
            console.log('Selected file:', filePath);
            // Do something with the path (like uploading or previewing)
          } else {
            console.log('No file selected');
          }
        };
    
        return <button onClick={handleSelect}>Select Video</button>;
    }

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
        
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        formData.append("filename", filePath);


        // handle as json (for debugging)
        //const formJson = Object.fromEntries(formData.entries());
        //console.log(formJson);

        // You can pass formData as a fetch body directly:
        fetch('/api/processVideo', { method: form.method, body: formData });
    }
    return (
        <div>
            <form method="post" onSubmit={handleSubmit}>
                <VideoPicker />
                <hr />
                <label>
                    Prompt: <input name="prompt" defaultValue=""/>
                </label>
                <hr />
                <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" type="submit">Submit</button>
            </form>
            <button className="bg-blue-500">Test</button>
        </div>
    );
}
export default Upload;