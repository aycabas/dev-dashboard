import { Button } from "@fluentui/react-components";
import { mail } from "@microsoft/teams-js";
import "../styles/Common.css";
export const Mail = () => {
    // check to see if capability is supported
    if (mail.isSupported()) {
        return (
         
            <Button className="outlook-button" appearance={`primary`}
                onClick={async () => {
                    mail.composeMail({
                        type: mail.ComposeMailType.New,
                        subject: "Office oasis",
                        message: "Hello folks",
                        toRecipients: [
                            'aycabas@m365advocates.onmicrosoft.com',
                            'rabiawilliams@m365advocates.onmicrosoft.com'
                        ],
                    })
                }}>
                    Compose a mail
                </Button>
            
        )
    };
    // return empty fragment if capability is not supported
    return (<></>);
}

export const MailIsSupported = () => mail.isSupported();