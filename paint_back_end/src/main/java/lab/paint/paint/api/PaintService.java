package lab.paint.paint.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Stack;

@Service
public class PaintService {


    private Stack<Save[]> saveStack = new Stack<Save[]>();
    private Stack<Save[]> saveRedo = new Stack<Save[]>();


    public void clear(){
        saveStack.clear();
        saveRedo.clear();
        System.out.println("Cleared!");
    }

    public void addNew(Save[] save) {
        saveStack.push(save);
    }

    public Save[] undo() {
        saveRedo.push(saveStack.pop());
        return saveStack.peek();
    }

    public Save[] redo() {
        saveStack.push(saveRedo.pop());
        return saveStack.peek();
    }
    public Save[] save(){
       // Save s = new Save();
        //s.setID("1");
        //s.setColourfill("12");
        //s.setH(12);
        //Save[] save = {s};
        return saveStack.peek();
    }
}
