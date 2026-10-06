// Permanently redirect every www request to the same path on the bare domain.
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.protocol = "https:"; // always land on the secure site
    url.hostname = "mamfeapostolicschoolcomplex.com";
    return Response.redirect(url.toString(), 301);
  },
};
