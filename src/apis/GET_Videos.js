async function fetchVideos(searchString, resourceType) {
	const apiKey = import.meta.env.VITE_YT_DATA_API_KEY;

	const url = new URL("https://www.googleapis.com/youtube/v3/search");
	const params = {
		q: searchString,
		type: resourceType,
		part: "snippet",
		maxResults: 15,
		key: apiKey,
	};
	url.search = new URLSearchParams(params).toString();

	try {
		const res = await fetch(url);
		const data = await res.json();
		return data;
	} catch (err) {
		console.error("Error fetching videos:", err);
		return null; // return null or throw error based on your use case
	}
}

export default fetchVideos;
