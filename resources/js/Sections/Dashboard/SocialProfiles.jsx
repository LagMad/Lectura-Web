import React from "react";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";

const SocialProfiles = () => {
    return (
        <div className="flex flex-col gap-10 w-full">
            <Input label={"Twitter"} />
            <Input label={"Facebook"} />
            <Input label={"Instagram"} />
            <Input label={"GitHub"} />
            <Input label={"LindkedIn"} />
            <div className="flex self-end">
                <Button>Save Changes</Button>
            </div>
        </div>
    );
};

export default SocialProfiles;
