import { TitleField, BodyField } from './Fields';

function Section({title, body, component}) {
    return (
        <div className={title}>
            <TitleField titleText={title} />
            <BodyField bodyText={body} />
            {component}
        </div>
    );
}

export default Section;
