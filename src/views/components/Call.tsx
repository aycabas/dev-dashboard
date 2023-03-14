import { Button } from "@fluentui/react-components";
import { call } from "@microsoft/teams-js";

export const Call = () => {
       // check to see if capability is supported
    if (call.isSupported()) {
        // return button to start a call
        return (
            <Button  appearance={`primary`}
            onClick={async () => {
                await call.startCall({
                    targets: [
                        'aycabas@m365advocates.onmicrosoft.com',
                        'rabiawilliams@m365advocates.onmicrosoft.com'
                    ],
                    requestedModalities: [
                        call.CallModalities.Audio,
                        call.CallModalities.Video,
                        call.CallModalities.VideoBasedScreenSharing,
                        call.CallModalities.Data
                    ]
                })
            }}>
            Start a call
            </Button>
        )
    };
    // return empty fragment if capability is not supported
    return (<></>);
}

export const CallIsSupported = () => call.isSupported();