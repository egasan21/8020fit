import { useEffect } from "react";

const AIchatbot = () => {
  useEffect(() => {
    // Create the script element for Botpress WebChat
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v0/inject.js";
    script.async = true;
    script.onload = () => {
      (window as any).botpressWebChat.init({
        botId: "<09aa722a-cdff-4e9f-8d57-e3539ae0173c>", // Replace with your actual Botpress bot ID
        clientId: "<09aa722a-cdff-4e9f-8d57-e3539ae0173c>", // Replace with your actual client ID
        hostUrl: "https://cdn.botpress.cloud/webchat/v0",
        messagingUrl: "https://messaging.botpress.cloud",
        botName: "Test",
        containerWidth: "90%", // Full screen width
        layoutWidth: "90%", // Full screen layout
        hideWidget: true, // Hides the widget
        disableAnimations: true, // Disables animations
      });

      // Automatically open the chatbot when it's loaded
      (window as any).botpressWebChat.onEvent(() => {
        (window as any).botpressWebChat.sendEvent({ type: "show" });
      }, ["LIFECYCLE.LOADED"]);
    };

    // Append the script to the document body
    document.body.appendChild(script);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      {/* The Botpress WebChat will automatically attach itself */}
    </div>
  );
};

export default AIchatbot;
