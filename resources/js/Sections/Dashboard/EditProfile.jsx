import React from "react";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";

const EditProfile = () => {
    return (
        <div className="flex flex-col justify-start items-start gap-20 w-full">
            <div className="flex flex-col justify-start items-start gap-10 w-full">
                <Input
                    label={"Name"}
                    placeholder={"Your name here..."}
                    required={true}
                />
                <Input label={"Location"} placeholder={"Choose Location"} />
                <Input
                    label={"Bio"}
                    placeholder={"Start typing about you!"}
                    description={"Brief description for your profile."}
                />
            </div>
            <div className="flex flex-col justify-start items-start gap-10 w-full">
                <div className="flex flex-col justify-start items-center gap-2 w-full">
                    <div className="text-lg font-bold text-black w-full">
                        CONTACT DETAIL
                    </div>
                    <hr className="h-[0.5px] w-full border-cust-gray" />
                    <div className="flex px-10 py-5 bg-[#EDEDED] text-[#8991FF] text-lg rounded-lg w-full text-center">
                        <div className="w-full">
                            Your contact details will only be visible if you're
                            a Designer Advertiser. <span className="font-semibold">Learn More</span>
                        </div>
                    </div>
                </div>
                <Input label={"Email"} placeholder={"Your email here..."}/>
                <Input label={"Phone Number"} placeholder={"08xxxxxxxxxx"}/>
            </div>
            <div className="flex self-end">
                <Button>Save Changes</Button>
            </div>
        </div>
    );
};

export default EditProfile;
