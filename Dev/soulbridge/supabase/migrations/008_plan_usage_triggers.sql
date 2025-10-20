-- ============================================
-- MIGRATION: Plan Usage Automatic Updates
-- Description: Triggers to automatically update plan_usage counts
-- when memorials are created/deleted
-- ============================================

-- Function to update memorial count after memorial creation
CREATE OR REPLACE FUNCTION update_memorial_count_on_create()
RETURNS TRIGGER AS $$
DECLARE
    v_active_plan_id UUID;
BEGIN
    -- Get the user's active plan ID
    SELECT id INTO v_active_plan_id
    FROM user_plans
    WHERE profile_id = NEW.profile_id
      AND plan_status = 'active'
      AND valid_until > NOW()
    ORDER BY created_at DESC
    LIMIT 1;

    -- Update the memorial count if active plan exists
    IF v_active_plan_id IS NOT NULL THEN
        UPDATE plan_usage
        SET current_memorials_count = current_memorials_count + 1,
            updated_at = NOW()
        WHERE plan_id = v_active_plan_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update memorial count after memorial deletion
CREATE OR REPLACE FUNCTION update_memorial_count_on_delete()
RETURNS TRIGGER AS $$
DECLARE
    v_active_plan_id UUID;
BEGIN
    -- Get the user's active plan ID
    SELECT id INTO v_active_plan_id
    FROM user_plans
    WHERE profile_id = OLD.profile_id
      AND plan_status = 'active'
      AND valid_until > NOW()
    ORDER BY created_at DESC
    LIMIT 1;

    -- Update the memorial count if active plan exists
    IF v_active_plan_id IS NOT NULL THEN
        UPDATE plan_usage
        SET current_memorials_count = GREATEST(0, current_memorials_count - 1),
            updated_at = NOW()
        WHERE plan_id = v_active_plan_id;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment memorial count when memorial is created
CREATE TRIGGER increment_memorial_count_trigger
    AFTER INSERT ON memorials
    FOR EACH ROW
    EXECUTE FUNCTION update_memorial_count_on_create();

-- Trigger to decrement memorial count when memorial is deleted
CREATE TRIGGER decrement_memorial_count_trigger
    AFTER DELETE ON memorials
    FOR EACH ROW
    EXECUTE FUNCTION update_memorial_count_on_delete();

-- ============================================
-- Backfill existing memorial counts
-- ============================================

-- Update existing plan_usage records with correct memorial counts
DO $$
DECLARE
    plan_record RECORD;
    memorial_count INTEGER;
BEGIN
    FOR plan_record IN
        SELECT pu.id as usage_id, up.profile_id
        FROM plan_usage pu
        JOIN user_plans up ON pu.plan_id = up.id
        WHERE up.plan_status = 'active'
    LOOP
        -- Count memorials for this profile
        SELECT COUNT(*) INTO memorial_count
        FROM memorials
        WHERE profile_id = plan_record.profile_id;

        -- Update the usage count
        UPDATE plan_usage
        SET current_memorials_count = memorial_count,
            updated_at = NOW()
        WHERE id = plan_record.usage_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
