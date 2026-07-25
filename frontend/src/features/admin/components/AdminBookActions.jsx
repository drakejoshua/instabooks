import Button from "../../../shared/components/Button";
import AltButton from "../../../shared/components/AltButton";

function AdminBookActions() {
    return <div
        className="
            mt-12
            flex
            items-center
            gap-4
        "
    >
        <Button>
            Edit
        </Button>

        <AltButton>
            Delete
        </AltButton>
    </div>;
}

export default AdminBookActions;
