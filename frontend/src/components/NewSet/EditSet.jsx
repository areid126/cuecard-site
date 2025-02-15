import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SetForm from "./SetForm";
import app from '../../utils/axiosConfig'



const EditSet = ({ user }) => {
    const { id } = useParams(); // Get the id of the set being studied
    const [set, setSet] = useState(undefined);
    const [loading, setLoading] = useState(true);

    // Use an effect to get the set to study
    useEffect(() => {

        const getSet = async () => {
            try {
                const res = await app.get(`/api/set/${id}`);
                if (res) {
                    setSet(res.data);
                    setLoading(false);
                }
            } catch (err) {
                // Do Nothing if there is no set
            }
        }

        getSet();
    }, []);

    return (
        <>
            {(loading) ? 
                <section class="min-h-[87vh] px-56 flex items-center justify-center pt-14 text-zinc-800">
                    <img src="/bouncing-squares.svg" class="h-48 opacity-[0.2]"></img>
                </section>
                :
                <SetForm set={set} user={user} formName="Edit Set" edit={true} />
            }
        </>
    );
}


export default EditSet;