import React from "react";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";

const General = () => {
    return (
        <div className="flex flex-col gap-10 w-full">
            <Input
                label={"Username"}
                placeholder={"Your username here..."}
                description={
                    "Your MAN2 Website URL: https://perpus.man2kotamalang.sch.id/krisnaliantara_"
                }
            />
            <Input label={"Email"} placeholder={"Your email here..."} />
            <div className="flex self-end">
                <Button>Save Changes</Button>
            </div>
        </div>
    );
};

export default General;
