import React from "react";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";

const Password = () => {
    return (
        <div className="flex flex-col gap-10 w-full">
            <Input label={"Old Password"} />
            <Input
                label={"New Password"}
                description={"Minimum 6 characters"}
            />
            <div className="flex self-end">
                <Button>Save Changes</Button>
            </div>
        </div>
    );
};

export default Password;
